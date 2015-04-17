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

	get: function (username) {
		return request
			.get(PREFIX + '/' + username);
	},

	getListening: function (username) {
		return request
			.get(PREFIX + '/' + username + '/listening');
	},

	getListeners: function (username) {
		return request
			.get(PREFIX + '/' + username + '/listeners');
	},

	listen: function (username) {
		return request
			.post(PREFIX + '/' + username + "/listen");
	},

	stopListen: function (username) {
		return request
			.del(PREFIX + '/' + username + "/listen")
	},

	loadShouts: function (username, type) {
		return request
			.get(PREFIX + '/' + username + '/shouts')
			.query({type: type || "all"});
	},

	list: function (query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	}

};
