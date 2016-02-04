

module.exports = function (client, path) {
	    return function (session, data) {
		    return client.post(path + "/verify_email" , {
			    accessToken: session && session.accessToken ? session.accessToken : null,
			    data: JSON.stringify(data)
		});
	};
};
