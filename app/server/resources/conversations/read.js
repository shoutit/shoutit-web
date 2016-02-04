/**
 * Created by Philip on 22.06.2015.
 */

module.exports = function (client, path) {
	  return function (session, id) {
		  return client.post(path + "/" + id, {
			  accessToken: session && session.accessToken ? session.accessToken : null,
		});
	};
};
