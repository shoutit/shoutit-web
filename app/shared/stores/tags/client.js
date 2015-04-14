/**
 * Created by Philip on 02.03.2015.
 */

var request = require('superagent');

var PREFIX = "/api/tags";

module.exports = {
	list: function (query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	},

	get: function (tagName) {
		return request
			.get(PREFIX + '/' + tagName)
	},

	listen: function (tagName) {
		return request
			.post(PREFIX + '/' + tagName + '/listen');
	},

	unlisten: function (tagName) {
		return request
			.del(PREFIX + '/' + tagName + '/listen');
	},

	getListeners: function (tagName) {
		return request
			.get(PREFIX + '/' + tagName + '/listeners');
	},

	getShouts: function (tagName, query) {
		return request
			.get(PREFIX + '/' + tagName + '/shouts')
			.query(query);
	}
};
