/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	  return function (session, id) {
		  return client.get(path + "/" + id, {
			  accessToken: session && session.accessToken ? session.accessToken : null
		});
	};
};
