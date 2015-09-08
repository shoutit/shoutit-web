

module.exports = function (client, path) {
	return function (session, data) {
		console.log('heyyy');
		return client.post(path + '/change_password' , {
			accessToken: session && session.accessToken ? session.accessToken : null,
			data: data
		});
	};
};