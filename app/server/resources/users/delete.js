/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	return function (session, username) {
		return client.del(path + '/' + username, {
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
