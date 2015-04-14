/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	return function (session, username, type, before, after) {
		var query = {};

		if (type) {
			query.shout_type = type
		}

		if (before) {
			query.before = before;
		}

		if (after) {
			query.after = after;
		}

		return client.get(path + '/' + username + '/shouts', {
			query: query,
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
