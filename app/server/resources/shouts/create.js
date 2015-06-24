/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function (session, data) {
		return client.json('POST', path, data, {
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
