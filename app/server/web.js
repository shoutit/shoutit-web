"use strict";

var express = require('express');

var cons = require('consolidate'),
	serveStatic = require('serve-static'),
	path = require('path');

var React = require('react'),
	Router = require('react-router');

var oauth = require('./auth/oauth'),
	ShoutitClient = require('./resources'),
	apiRouter = require('./routes');

var Flux = require('../shared/flux'),
	Routes = require('../shared/routes.jsx'),
	DocumentTitle = require('react-document-title');

// middleware
var //bunyan = require('express-bunyan-logger'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
//csurf = require('csurf'),
	compression = require('compression');

module.exports = function (app) {
	// view stuff
	app.engine('jade', cons.jade);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

	// gzip it
	app.use(compression());

	// TODO: Replace by nginx static serving
	app.use(serveStatic('./app/public'));

	//app.use(bunyan());
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
		var user = req.session.user;

		console.time("ShoutsRequest");
		ShoutitClient
			.shouts()
			.list(req.session)
			.on('complete', function (shouts) {
				console.timeEnd("ShoutsRequest");

				var flux = Flux(null, user, shouts);

				var render = function () {
					console.time("RenderReact");
					var serializedFlux = flux.serialize();
					Router.run(Routes, req.url, function (Handler, state) {
						var content = React.renderToString(
							React.createElement(Handler, {
								key: state.path,
								flux: flux
							})
						);
						console.timeEnd("RenderReact");

						res.render('index', {
							reactMarkup: content,
							serializedFlux: serializedFlux,
							// Extract title from current Router State
							title: DocumentTitle.rewind()
						});
					});
				};

				setImmediate(function () {
					render();
				});
			});


	});
};

