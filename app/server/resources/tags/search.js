/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	return function (session, searchTerm, type, city, country, page) {
		var query = {
			search: searchTerm
		};

		if(type) {
			query.type = type;
		}

		if(city) {
			query.city = city
		}

		if(country) {
			query.country = country;
		}

		if (page) {
			query.page = page;
		}

		return client.get(path, {
			query: query,
			accessToken: session && session.accessToken ? session.accessToken : null
		});
	}
};
