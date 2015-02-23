/**
 * Created by Philip on 12.01.2015.
 */

var _ = require('lodash'),
	Promise = require('bluebird'),
	request = require('superagent');


var ENDPOINT_SERVER = 'dev.shoutit.com',
	HEADERS = {
		"shoutit-client": "web"
	},
	ACCESSTOKEN_ENDPOINT = '/api/v2/oauth2/access_token',
	USER_ENDPOINT = '/api/v2/users/me',
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

	return new Promise(function (resolve, reject) {
		request
			.post(ENDPOINT_SERVER + ACCESSTOKEN_ENDPOINT)
			.set(HEADERS)
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
		req.session.scope = resp.scope.split[' '];

		return accessToken;
	}
}

function fetchUser (accessToken) {
		return new Promise(function (resolve, reject) {
			request
				.get(ENDPOINT_SERVER + USER_ENDPOINT)
				.set(HEADERS)
				.set('Authorization', 'Bearer ' + accessToken)
				.accept('json')
				.end(function (err, resp) {
					if(err) {
						console.error(err);
						reject(err);
					} else {
						console.dir(resp.body);
						resolve(resp.body)
					}
				});
		});
}

module.exports = {
	gplusAuth: function (req, res) {
		var code = req.body.token;
		if (code) {
			requestAccessToken('gplus', code)
				.then(updateSession(req))
				.then(fetchUser)
				.then(function(user) {
					res.json(user);
				})
				.catch(function (err) {
					res.status(500).send(err);
				});
		} else {
			res.status(400).send('Bad Request');
		}
	},

	fbAuth: function (req, res) {
		var token = req.body.token;
		if (token) {
			requestAccessToken('fb', token)
				.then(updateSession(req))
				.then(fetchUser)
				.then(function(user) {
					res.json(user);
				})
				.catch(function (err) {
					res.status(500).send(err);
				});
		} else {
			res.status(400).send('Bad Request');
		}
	},

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