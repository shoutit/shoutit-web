/**
 * Created by Philip on 22.06.2015.
 */

module.exports = function (client, path) {
	return function (session, data) {
		return client.post(path + '/auth', {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: data
		});
	};
};

