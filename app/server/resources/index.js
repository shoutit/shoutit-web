/**
 * Created by Philip on 27.02.2015.
 */
var rest = require('restler');

console.log("API_URL:", process.env.API_URL);

var ENDPOINT_SERVER = process.env.API_URL || 'http://dev-api-shoutit-com-qm7w6bwy42b2.runscope.net/v2/';

var ShoutitClient =  rest.service(function (endpoint) {
	this.defaults.headers = {
		"Accept": "application/json",
		"Content-Type": "application/json"
	};
	this.baseURL = endpoint;
}, {}, {
	shouts: require('./shouts'),
	users: require('./users'),
	tags: require('./tags'),
	//search: require('./search'),
	misc: require('./misc')
});

module.exports = new ShoutitClient(ENDPOINT_SERVER);

