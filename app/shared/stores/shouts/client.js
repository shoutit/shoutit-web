/**
 * Created by Philip on 02.03.2015.
 */

var request = require('superagent');

var PREFIX = "/api/shouts";

module.exports = {
	list: function(query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	},
	get: function(shoutId) {
		return request
			.get(PREFIX + '/' + shoutId)
	}
};
