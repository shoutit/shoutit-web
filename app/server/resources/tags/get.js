/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function (session, tagName) {
		return client.get(path + '/' + tagName, {
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
