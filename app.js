/**
 * Created by Philip on 12.01.2015.
 */

"use strict";

var express = require('express');

// JSX Transpiler
require('node-jsx').install({extension: '.jsx'});

var	app = express();

require('./app/server/web.jsx')(app, __dirname);

// startup
var port = process.env.port || 8080;
app.listen(port, function() {
	console.log("Listening at http://localhost:" + port);
});