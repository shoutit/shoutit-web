"use strict";

if (["developmentLocal"].indexOf(process.env.NODE_ENV) < 0) {
	require('newrelic');
}

require("babel-core/register");

/**
 * Created by Philip on 12.01.2015.
 */
var express = require('express');

var app = express();

require('./app/server/web.js')(app);

// startup
var port = process.env.port || 8080;
app.listen(port, function () {
	console.log("Listening at http://localhost:" + port);
});
