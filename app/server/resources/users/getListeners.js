/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	  return function (session, username, page) {
		  var query = {};

		  if (page && !isNaN(page)) {
			  query.page = page;
		}

		  return client.get(path + "/" + username + "/listeners", {
			  accessToken: session && session.accessToken ? session.accessToken : null,
			  query: query
		});
	};
};
