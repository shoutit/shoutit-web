/**
 * Created by Philip on 27.02.2015.
 */
/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	      return function (session, username, query) {

		      return client.get(path + "/" + username + "/shouts", {
			      query: query,
			      accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
