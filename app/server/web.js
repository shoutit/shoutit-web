"use strict";

var express = require('express');

var cons = require('consolidate'),
	serveStatic = require('serve-static'),
	path = require('path'),
	url = require('url'),
	merge = require('lodash/object/merge'),
	object = require('lodash/array/object'),
	pluck = require('lodash/collection/pluck'),
	Promise = require('bluebird');

var React = require('react'),
	Router = require('react-router');

var oauth = require('./auth/oauth'),
	ShoutitClient = require('./resources'),
	apiRouter = require('./routes'),
	resetPass = require('./services/resetPassword'),
	verifyEmail = require('./services/verifyEmail');

var Flux = require('../shared/flux'),
	Routes = require('../shared/routes.jsx')(null),
	DocumentTitle = require('react-document-title');

// middleware
var morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
//csurf = require('csurf'),
	compression = require('compression'),
	cors = require('cors');

// Runtime Data:
var SERVER_ROOT = process.env.SERVER_ROOT || "localhost:8080";
var graphData = require('./resources/consts/graphData');
var currencies, categories, sortTypes;
var whitelist = ['https://shoutit.com', 'https://www.shoutit.com', 'http://dev.www.shoutit.com'];
if (["developmentLocal"].indexOf(process.env.NODE_ENV) >= 0) {
	whitelist.push('http://localhost');
}
var corsOptions = {
	origin: function (origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};


function updateCurrencies() {
	ShoutitClient.misc().currencies()
		.on('complete', function (result, resp) {
			if (result instanceof Error || resp.statusCode !== 200) {
				console.error("Cannot fetch currencies.");
			} else {
				currencies = object(pluck(result, "code"), result);
				console.log("Fetched " + result.length + " currencies.");
			}
		});
}

updateCurrencies();

// Update Currencies every 2 minutes
setInterval(updateCurrencies, 1000 * 60 * 2);

function updateCategories() {
	ShoutitClient.misc().categories()
		.on('complete', function (result, resp) {
			if (result instanceof Error || resp.statusCode !== 200) {
				console.error("Cannot fetch currencies.");
			} else {
				categories = result;
				console.log("Fetched " + result.length + " categories.");
			}
		});
}

updateCategories();

setInterval(updateCategories, 1000 * 60 * 5);

ShoutitClient.misc().sortTypes()
	.on('complete', function (result, resp) {
		if (result instanceof Error || resp.statusCode !== 200) {
			console.error("Cannot fetch currencies.");
		} else {
			sortTypes = object(pluck(result, "type"), pluck(result, "name"));
			console.log("Fetched " + result.length + " sortTypes.");
		}
	});


function fetchData(userSession, routes, params, query) {
	var data = {};
	//return Promise.resolve(data);
	return Promise.all(routes.filter(function (route) {
		return route.handler.fetchData;
	}).map(function (route) {
		return new Promise(function (resolve) {
			route.handler.fetchData(ShoutitClient, userSession, params, route.name, query)
				.on('complete', function (result, resp) {
					if (result instanceof Error || resp.statusCode !== 200) {
						resolve({});
					} else {
						resolve(result);
					}
				});
		}).then(function (fetched) {
				console.log("Fetched data for", route.name);
				data[route.name] = fetched;
			});
	})).then(function () {
		return data;
	});
}


function getMetaFromData(relUrl, innerRoute, data) {
	var addData;

	switch (innerRoute.name) {
		case "shout":
			var shout = data.shout;
			if (shout) {
				if (shout.type == "offer") {
					addData = {
						type: "shout",
						shoutType: "offer",
						shoutTypePrefix: "Offer",
						title: "Shoutit - " + shout.title,
						image: shout.thumbnail,
						user: shout.user.name,
						description: "Offer by" + shout.user.name + " - " + shout.text,
						price: shout.price ? shout.price + " " + currencies[shout.currency].name : "",
						location: shout.location.city + " - " + shout.location.country
					};
				} else if (shout.type === "request") {
					addData = {
						type: "shout",
						shoutType: "request",
						shoutTypePrefix: "Request",
						title: "Shoutit - " + shout.title,
						image: shout.thumbnail,
						user: shout.user.name,
						description: "Offer by" + shout.user.name + " - " + shout.text,
						price: shout.price ? shout.price + " " + currencies[shout.currency].name : "",
						location: shout.location.city + " - " + shout.location.country
					};
				}

			}
			break;
		case "user":
		case "useroffers":
		case "userrequests":
		case "settings":
		case "listeners":
		case "listening":
			var user = data.user;
			if (user) {
				addData = {
					type: "user",
					title: "Shoutit Profile - " + user.name,
					image: user.image,
					description: "Shoutit - " + user.name + "'s profile - See the users shouts."
				};
			}
			break;
		default:
			addData = {
				type: "home",
				image: url.resolve(SERVER_ROOT, graphData.image)
			};
	}
	return merge({
		url: url.resolve(SERVER_ROOT, relUrl)
	}, graphData, addData);
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
				var flux = new Flux(null, user, data, state.params, currencies, categories, sortTypes),
					serializedFlux = flux.serialize(),
					content = React.renderToString(
						React.createElement(Handler, {
							flux: flux,
							params: state.params
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

redisOptions.host = process.env.REDIS_HOST || "localhost";

console.log("REDIS_HOST:", redisOptions.host);

function detectionMiddleware(req, res, next) {
	var ua = req.headers['user-agent'],
		$ = {};

	if (/mobile/i.test(ua)) {
		$.Mobile = true;
	}

	if (/like Mac OS X/.test(ua)) {
		$.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
		if (/iPhone/.test(ua)) {
			$.iPhone = /iPhone/.test(ua);
		}
		if (/iPad/.test(ua)) {
			$.iPad = /iPad/.test(ua);
		}
	}

	if (/Android/.test(ua)) {
		$.Android = /Android( )?(; (Tablet|Mobile); rv:)?([0-9\.]+)[\);]/.exec(ua)[4];
	}

	if (/webOS\//.test(ua)) {
		$.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
	}

	if (/(Intel|PPC) Mac OS X/.test(ua)) {
		$.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
	}

	if (/Windows NT/.test(ua)) {
		$.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
	}

	req.devices = $;

	next();
}

module.exports = function (app) {
	// view stuff
	app.engine('jade', cons.jade);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

	// CORS Protection
	app.use(cors(corsOptions));

	// gzip it
	app.use(compression());

	// TODO: Replace by nginx static serving
	app.use(serveStatic('./app/public'));

	if (process.env.NODE_ENV === "developmentLocal") {
		var webpackDevMiddleware = require("webpack-dev-middleware"),
			webpack = require("webpack");

		app.use(webpackDevMiddleware(webpack(
				require('../../webpack.config')),
			{
				publicPath: "/",
				stats: {
					hash: true,
					version: false,
					timings: true,
					assets: false,
					chunks: true,
					chunkModules: false,
					modules: true,
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

	var authRouter = new express.Router();

	authRouter.post('/gplus', oauth.gplusAuth);
	authRouter.post('/fb', oauth.fbAuth);
	authRouter.post('/shoutit', oauth.siAuth);
	authRouter.get('/logout', oauth.logout);
	authRouter.post('/signup', oauth.signup);
	authRouter.post('/forget', oauth.forgetPass);

	// Services router
	var servicesRouter = new express.Router();

	servicesRouter.get('/reset_password', resetPass.get);
	servicesRouter.post('/reset_password', resetPass.post);

	servicesRouter.get('/verify_email', verifyEmail);

	app.use('/auth', authRouter);
	app.use('/services', servicesRouter);
	app.use('/api', apiRouter);

	//Redirect all trailing slashes
	app.use(function (req, res, next) {
		if (req.path.substr(-1) == '/' && req.path.length > 1) {
			var query = req.url.slice(req.path.length);
			res.redirect(301, req.path.slice(0, -1) + query);
		} else {
			next();
		}
	});

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

	app.use('/user/:username', function userInitRedirect(req, res, next) {
		if (req.url === '/') {
			var user = req.session ? req.session.user : null;

			if (user && user.username === req.params.username) {
				next();
			} else {
				res.redirect('/user/' + req.params.username + '/offers');
			}
		} else {
			next();
		}
	});

	app.use('/search/:term/shouts', function shoutSearchRedirect(req, res) {
		res.redirect('/search/' + req.params.term);
	});

	app.use('/chat/?*', function redirectNotLoggedUser(req, res, next) {
		if (req.session && req.session.user) {
			next();
		} else {
			res.redirect('/login');
		}
	});

	app.use('/app', detectionMiddleware, function (req, res) {
			console.log(req.devices);

			if (req.devices) {
				if (req.devices.iOS || req.devices.iPhone || req.devices.iPad) {
					console.log("Detected iOS Device");
					res.redirect('https://geo.itunes.apple.com/de/app/shoutit-app/id947017118?mt=8');
				} else if (req.devices.Android) {
					console.log("Detected Android Device");
					res.redirect('https://play.google.com/store/apps/details?id=com.shoutit.app.android');
				} else {
					res.redirect('/');
				}
			} else {
				res.redirect('/');
			}
		}
	);

	// Catch SMS Code registry
	var smsCodeRegex = /^(z|Z)[a-zA-Z0-9]{5,9}/;
	app.use('/:smsCode', function redirectSMSCode(req, res, next) {
		if (req.params.smsCode && req.params.smsCode.match(smsCodeRegex)) {
			oauth.sms(req, req.params.smsCode)
				.then(function (user) {
					ShoutitClient.users().getShouts(req.session, user.username)
						.on('complete', function (result, resp) {
							if (result instanceof Error || resp.statusCode !== 200) {
								next(result);
							} else {
								var firstShout = result.results[0];
								res.redirect("/shout/" + firstShout.id);
							}
						});
				}, function () {
					res.redirect("/");
				});
		} else {
			next();
		}
	});

	app.get('*', reactServerRender);
};
