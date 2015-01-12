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

// config
app.engine('jade', cons.jade);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(serveStatic('public'));


// routes
var React = require('react');
var App = React.createElement(require('./app/components/app.jsx'));

app.get('/', function (req, res) {
	res.render('index', {reactOutput: React.renderToString(App)});
});

app.get('/testoauth', function (req, res) {
	oauth.getRequestTokenPromise()
		.then(function (parsed) {
			res.json(parsed);
		}, function (err) {
			res.send(err);
		})
});


// startup
app.listen(process.env.port || 8080);