/**
 * Created by Philip on 22.06.2015.
 */

var url = require('url');

module.exports = function (client, path) {
	return function (session, id, query) {
		return client.get(url.resolve(path, id), {
			query: query,
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
