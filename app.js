/**
 * Created by Philip on 12.01.2015.
 */

"use strict";

var express = require('express');
var cons = require('consolidate');
var path = require('path');
var serveStatic = require('serve-static');
var app = express();

var oauth = require('./auth/oauth');
// JSX Transpiler
require('node-jsx').install({extension: '.jsx'});

// CONFIG

// view stuff
app.engine('jade', cons.jade);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// should be replaced by nginx static serving
app.use(serveStatic('public'));

// middleware
var //bunyan = require('express-bunyan-logger'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	csurf = require('csurf');

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


// routes
var React = require('react');
var App = React.createElement(require('./app/components/app.jsx'));

app.get('/', function (req, res) {
	res.render('index', {
		title: "Home - Shout It",
		reactOutput: React.renderToString(App)
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
			console.log("Yolo");
			res.json(parsed)
		}, function (err) {
			console.log(err);
			res.send(err);
		});
});


// startup
app.listen(process.env.port || 8080);