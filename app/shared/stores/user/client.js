/**
 * Created by Philip on 02.03.2015.
 */

var request = require('superagent');

var PREFIX = "/api/users";

module.exports = {
	update: function(update) {
		return request
			.post(PREFIX + '/me')
			.send(update);
	},
	get: function(userId) {
		return request
			.get(PREFIX + '/' + userId)
	}
};
