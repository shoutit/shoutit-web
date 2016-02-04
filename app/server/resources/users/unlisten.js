/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	      return function (session, username) {
		      return client.del(path + "/" + username + "/listen", {
			      accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
