/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function (session, username, patch) {
		return client.patch(path + '/' + username, {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: JSON.stringify(patch)
		});
	}
};
