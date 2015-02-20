"use strict";

var cons = require('consolidate'),
	serveStatic = require('serve-static'),
	path = require('path');

var React = require('react'),
	Router = require('react-router');

var oauth = require('./auth/oauth');

var Flux = require('../shared/flux'),
	Routes = require('../shared/routes.jsx'),
	DocumentTitle = require('react-document-title');

// middleware
var bunyan = require('express-bunyan-logger'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	csurf = require('csurf'),
	compression = require('compression');

module.exports = function (app) {
	// view stuff
	app.engine('jade', cons.jade);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

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
	// app.use(csurf());



	app.use(function (req, res) {
		//var flux = Flux();

		var render = function () {
			console.time("RenderReact");
			//var serializedFlux = flux.serialize();
			Router.run(Routes, req.url, function (Handler, state) {
				var content = React.renderToString(
					React.createElement(Handler, {
						key: state.path
					})
				);
				console.timeEnd("RenderReact");

				res.render('index', {
					reactMarkup: content,
					serializedFlux: "{}",
					// TODO Extract title from current Router State
					title: DocumentTitle.rewind()
				});
			});
		};

		setImmediate(function () {
			render();
		});
	});

	app.get('/testoauth', function (req, res) {
		oauth.getRequestTokenPromise()
			.then(function (parsed) {
				res.json(parsed);
			}, function (err) {
				res.send(err);
			})
	});

	app.post('/oauth/gplus', function (req, res) {
		var code = req.body.code;
		oauth.getRequestTokenPromise()
			.then(oauth.getAccessTokenGPlusPromise(code))
			.then(function (parsed) {
				res.json(parsed)
			}, function (err) {
				console.log(err);
				res.send(err);
			});
	});

};

