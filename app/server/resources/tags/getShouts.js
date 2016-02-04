/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client, path) {
	      return function (session, tagName, query) {
		      return client.get(path + "/" + tagName + "/shouts", {
			      query: query,
			      accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
