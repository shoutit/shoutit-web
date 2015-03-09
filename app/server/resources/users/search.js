/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	return function (session, searchTerm, page) {
		var query = {
			search: searchTerm
		};

		if (page && isNumber(page)) {
			query.page = page;
		}

		return client.get(path, {
			query: query,
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
