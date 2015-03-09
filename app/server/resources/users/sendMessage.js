/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function (session, username, data) {
		return client.post(path + '/' + username + '/message', {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: data
		});
	}
};
