/**
 * Created by Philip on 22.06.2015.
 */

var url = require('url');

module.exports = function (client, path) {
	return function (session, id, data) {
		return client.post(url.resolve(path, id), {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: data
		});
	};
};

