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


function fetchData(session, routes, params) {
	var data = {};
	return Promise.all(routes.filter(function (route) {
		return route.handler.fetchData;
	}).map(function (route) {
		return new Promise(function (resolve, reject) {
			route.handler.fetchData(ShoutitClient, session, params, route.name)
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

module.exports = function (app) {
	// view stuff
	app.engine('jade', cons.jade);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

	// gzip it
	app.use(compression());

	// TODO: Replace by nginx static serving
	app.use(serveStatic('./app/public'));

	app.use(morgan('tiny'));
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(session({
		store: new RedisStore(),
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

	app.use(function (req, res) {
		var user = req.session ? req.session.user : null;

		// Run router to determine the desired state
		Router.run(Routes, req.url, function (Handler, state) {
			// Fetch data based on matching routes and params
			fetchData(req.session, state.routes, state.params)
				.then(function (data) {
					var flux = Flux(null, user, data),
						serializedFlux = flux.serialize(),
						content = React.renderToString(
							React.createElement(Handler, {
								flux: flux
							})
						);

					res.render('index', {
						reactMarkup: content,
						serializedFlux: serializedFlux,
						// Extract title from current Router State
						title: DocumentTitle.rewind()
					});
				});


		});
	});
};