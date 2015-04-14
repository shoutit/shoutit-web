/**
 * Created by Philip on 12.01.2015.
 */
var url = require('url');

var Promise = require('bluebird'),
	request = require('superagent');


var ENDPOINT_SERVER = process.env.API_URL || 'http://dev-api-shoutit-com-qm7w6bwy42b2.runscope.net/v2/',
	ACCESSTOKEN_ENDPOINT = 'oauth2/access_token',
	USER_ENDPOINT = 'users/me',
	CLIENT_ID = 'shoutit-web',
	CLIENT_SECRET = '0db3faf807534d1eb944a1a004f9cee3',
	GRANT_TYPES = {
		gplus: "gplus_code",
		fb: "facebook_access_token",
		refresh: "refresh_token"
	};

function requestAccessToken(type, grantToken) {
	var requestData = {
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		grant_type: GRANT_TYPES[type]
	};
	requestData[GRANT_TYPES[type]] = grantToken;

	console.log(requestData);
	console.log(url.resolve(ENDPOINT_SERVER,  ACCESSTOKEN_ENDPOINT));

	return new Promise(function (resolve, reject) {
		request
			.post(url.resolve(ENDPOINT_SERVER,  ACCESSTOKEN_ENDPOINT))
			.type('json')
			.accept('json')
			.send(requestData)
			.end(function (err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(res.body);
				}
			});
	});
}

function updateSession(req) {
	return function (resp) {
		var accessToken = req.session.accessToken = resp.access_token;
		req.session.refreshToken = resp.refresh_token;
		req.session.cookie.expires = new Date(Date.now() + parseInt(resp.expires_in));
		req.session.scope = resp.scope ? resp.scope.split[' '] : [];
		return accessToken;
	}
}

function fetchUser(accessToken) {
	return new Promise(function (resolve, reject) {
		request
			.get(ENDPOINT_SERVER + USER_ENDPOINT)
			.set('Authorization', 'Bearer ' + accessToken)
			.accept('json')
			.end(function (err, resp) {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					if (resp.body.id) {
						resolve(resp.body)
					} else {
						reject(resp.body);
					}
				}
			});
	});
}

function auth(type) {
	return function (req, res) {
		var code = req.body.token;
		if (code) {
			requestAccessToken(type, code)
				.then(updateSession(req))
				.then(fetchUser)
				.then(function (user) {
					console.log(user);
					req.session.user = user;
					res.json(user);
				})
				.catch(function (err) {
					console.log(err);
					res.status(500).send(err);
				});
		} else {
			res.status(400).send('Bad Request');
		}
	}
}

module.exports = {
	gplusAuth: auth('gplus'),

	fbAuth: auth('fb'),

	logout: function (req, res) {
		req.session.destroy(function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send({
					loggedOut: true
				});
			}
		});
	}
};