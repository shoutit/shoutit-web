/**
 * Created by Philip on 15.04.2015.
 */

var Promise = require('bluebird');

module.exports = function (client) {
	var shoutClient = client.shouts(),
		tagClient = client.tags(),
		userClient = client.users();

	function makePromiseFromRequest(req) {
		return new Promise(function (resolve, reject) {
			req
				.on('success', function (data) {
					resolve(data);
				})
				.on('fail', function (data, resp) {
					reject(data);
				})
				.on('error', function (err) {
					reject(data);
				});
		});
	}

	return function (req, res) {
		var term = req.params.term,
			session = req.session,
			searchQuery = {
				search: term
			};

		Promise.all([
			makePromiseFromRequest(shoutClient.list(session, searchQuery)),
			makePromiseFromRequest(tagClient.search(session, searchQuery)),
			makePromiseFromRequest(userClient.search(session, term))
		]).spread(function (shouts, tags, users) {
			res.json({
				shouts: shouts.results,
				tags: tags.results,
				users: users.results
			});
		});
	}
};
