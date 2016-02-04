/**
 * Created by Philip on 22.06.2015.
 */

module.exports = function (client, path) {
	  return function (session, data) {
		  return client.json("POST", path + "/auth", data, {
			  accessToken: session && session.accessToken ? session.accessToken : null,
		});
	};
};

