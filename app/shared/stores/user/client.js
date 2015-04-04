/**
 * Created by Philip on 02.03.2015.
 */

var request = require('superagent');

var PREFIX = "/api/users";

module.exports = {
	update: function (update) {
		return request
			.post(PREFIX + '/me')
			.send(update);
	},

	get: function (userId) {
		return request
			.get(PREFIX + '/' + userId);
	},

	getListening: function () {
		return request
			.get(PREFIX + '/me/listening');
	},

	getListeners: function () {
		return request
			.get(PREFIX + '/me/listeners');
	},

	listen: function (username) {
		return request
			.post(PREFIX + '/' + username + "/listen");
	},

	stopListen: function (username) {
		return request
			.del(PREFIX + '/' + username + "/list")
	},

	loadShouts: function(type) {
		return request
			.get(PREFIX + '/me/shouts')
			.query({type: type || "all"});
	}

};
