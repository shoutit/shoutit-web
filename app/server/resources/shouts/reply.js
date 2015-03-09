/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function (session, shoutId, data) {
		return client.post(path + '/' + shoutId, {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: {
				data
			}
		});
	}
};
