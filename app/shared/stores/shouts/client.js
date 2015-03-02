/**
 * Created by Philip on 02.03.2015.
 */

var request = require('superagent');

var PREFIX = "/api/shouts";

module.exports = {
	fetch: function(page) {
		return request
			.get(PREFIX + '/')
			.query({
				page: page
			})
	}
};
