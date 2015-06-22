/**
 * Created by Philip on 22.06.2015.
 */

module.exports = function (client, path) {
	return function (session) {
		return client.post(path, {
			accessToken: session && session.accessToken ? session.accessToken : null,
		});
	};
};
