/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	return function (session, username, type, page) {
		var query = {};

		if (type) {
			query.type = type
		}

		if (page) {
			query.page = page;
		}

		return client.get(path + '/' + username + '/shouts', {
			query: query,
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
