/**
 * Created by Philip on 27.02.2015.
 */
var rest = require('restler'),
	Promise = require('bluebird');

var ENDPOINT_SERVER = 'http://dev-shoutit-com-qm7w6bwy42b2.runscope.net/api/v2/';

var ShoutitClient =  rest.service(function (endpoint) {
	this.defaults.headers = {
		"Accept": "application/json",
		"Content-Type": "application/json"
	};
	this.baseURL = endpoint;
}, {}, {
	shouts: require('./shouts'),
	users: require('./users'),
	tags: require('./tags')
});

module.exports = new ShoutitClient(ENDPOINT_SERVER);

