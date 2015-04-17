"use strict";

var express = require('express');

var cons = require('consolidate'),
	serveStatic = require('serve-static'),
	path = require('path'),
	url = require('url'),
	Promise = require('bluebird');

var React = require('react'),
	Router = require('react-router');

var oauth = require('./auth/oauth'),
	ShoutitClient = require('./resources'),
	apiRouter = require('./routes');

var Flux = require('../shared/flux'),
	Routes = require('../shared/routes.jsx'),
	DocumentTitle = require('react-document-title');

// middleware
var morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
//csurf = require('csurf'),
	compression = require('compression');

var SERVER_ROOT = process.env.SERVER_ROOT || "localhost:8080";

function fetchData(session, routes, params, query) {
	var data = {};
	return Promise.all(routes.filter(function (route) {
		return route.handler.fetchData;
	}).map(function (route) {
		return new Promise(function (resolve, reject) {
			route.handler.fetchData(ShoutitClient, session, params, route.name, query)
				.on('complete', function (result, resp) {
					if (result instanceof Error || resp.statusCode !== 200) {
						resolve({});
					} else {
						resolve(result);
					}
				})
		}).then(function (fetched) {
				data[route.name] = fetched
			});
	})).then(function () {
		return data;
	});
}


function getMetaFromData(relUrl, innerRoute, data) {
	var meta = {};
	//console.log(innerRoute);
	//console.log(data);

	if (innerRoute.name === "shout") {
		var shout = data.shout;
		if (shout) {
			meta.title = "Shoutit - " + shout.title;
			meta.description = shout.text;
			meta.type = "article";
			meta.image = shout.thumbnail;
			meta.url = url.resolve(SERVER_ROOT, relUrl);
		}
	} else if (innerRoute.name === "user") {
		var user = data.user;
		if (user) {
			meta.title = "Shoutit Profile - " + user.username;
			meta.description = "Shoutit - " + user.name + "'s profile - See the users shouts.";
			meta.type = "profile";
			meta.image = user.image;
			meta.url = url.resolve(SERVER_ROOT, relUrl);
		}
	}
	return meta;
}

function reactServerRender(req, res) {
	var user = req.session ? req.session.user : null;

	// Run router to determine the desired state
	console.time("RouterRun");
	Router.run(Routes, req.url, function (Handler, state) {
		console.timeEnd("RouterRun");

		// Fetch data based on matching routes and params
		console.time("ApiFetch");
		fetchData(req.session, state.routes, state.params, state.query)
			.then(function (data) {
				console.timeEnd("ApiFetch");

				//console.dir(data, {depth: 2});

				console.time("RenderReact");
				var flux = Flux(null, user, data, state.params),
					serializedFlux = flux.serialize(),
					content = React.renderToString(
						React.createElement(Handler, {
							flux: flux
						}));
				console.timeEnd("RenderReact");

				var meta = getMetaFromData(req.url, state.routes[state.routes.length - 1], data);

				res.render('index', {
					reactMarkup: content,
					serializedFlux: serializedFlux,
					// Extract title from current Router State
					title: DocumentTitle.rewind(),
					graph: meta
				});
			});
	});
}

var redisOptions = {
	db: 11
};

if (process.env.REDIS_HOST) {
	redisOptions.host = process.env.REDIS_HOST || "localhost";
}

console.log("REDIS_HOST:", redisOptions.host);


module.exports = function (app) {
	// view stuff
	app.engine('jade', cons.jade);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

	// gzip it
	app.use(compression());

	// TODO: Replace by nginx static serving
	app.use(serveStatic('./app/public'));

	if (process.env.NODE_ENV === "development") {
		var webpackDevMiddleware = require("webpack-dev-middleware"),
			webpack = require("webpack");

		app.use(webpackDevMiddleware(webpack(require('../../webpack.config')), {
			publicPath: "/",
			stats: {
				hash: true,
				version: false,
				timings: true,
				assets: false,
				chunks: true,
				chunkModules: false,
				modules: false,
				cached: false,
				reasons: false,
				colors: true
			}
		}));
	}

	app.use(morgan('tiny'));
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(session({
		store: new RedisStore(redisOptions),
		secret: 'ShoutItOutLoudIntoTheCrowd',
		resave: false,
		saveUninitialized: true
	}));

	// TODO Add csrf tokens to the webapp
	//app.use(csurf());

	var authRouter = express.Router();

	authRouter.post('/gplus', oauth.gplusAuth);
	authRouter.post('/fb', oauth.fbAuth);
	authRouter.get('/logout', oauth.logout);

	app.use('/auth', authRouter);

	app.use('/api', apiRouter);

	// Redirects
	app.use('/s/:shoutId', function (req, res) {
		res.redirect('/shout/' + req.params.shoutId);
	});

	app.use('/u/:username', function (req, res) {
		res.redirect('/user/' + req.params.username);
	});

	app.use('/t/:tagName', function (req, res) {
		res.redirect('/tag/' + req.params.tagName);
	});

	app.use('/m/:msgId', function (req, res) {
		res.redirect('/message/' + req.params.msgId);
	});

	app.use('/profile', function (req, res) {
		var user = req.session ? req.session.user : null;

		if (user && user.username) {
			res.redirect('/user/' + user.username);
		} else {
			res.redirect('/login');
		}
	});

	app.use('/user/:username', function userInitRedirect (req, res, next) {
		if(req.url === '/') {
			var user = req.session ? req.session.user : null;

			if (user && user.username === req.params.username) {
				res.redirect('/user/' + req.params.username + '/settings');
			} else {
				res.redirect('/user/' + req.params.username + '/useroffers');
			}
		} else {
			next();
		}
	});

	app.use(reactServerRender);
};