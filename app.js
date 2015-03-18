"use strict";

/**
 * Created by Philip on 12.01.2015.
 */
var express = require('express');

// JSX Transpiler
require('node-jsx').install();

var	app = express();

require('./app/server/web.js')(app);

// startup
var port = process.env.port || 8080;
app.listen(port, function() {
	console.log("Listening at http://localhost:" + port);
});