/**
 * Created by Philip on 12.01.2015.
 */

var OAuth = require('oauth'),
	_ = require('lodash'),
	Promise = require('bluebird');

var oauth = new OAuth.OAuth(
	'http://127.0.0.1:8000/oauth/request_token/', //'http://shoutit.com:8000/oauth/request_token/',
	'http://shoutit.com:8000/oauth/access_token/',
	'shoutit-web',
	'64a542b1-1b2d-8503-6cbb-4cf8cea',
	'1.0',
	null,
	'HMAC-SHA1'
);

oauth.setClientOptions({
	requestTokenHttpMethod: 'GET'
});

module.exports = {
	getRequestTokenPromise: function () {
		return new Promise(function (resolve, reject) {
			oauth.getOAuthRequestToken(function (err, token, token_secret, parsedQueryString) {
				if (err) {
					reject(err.data)
				} else {
					var parsed;
					_.forEach(parsedQueryString, function (value, key) {
						try {
							parsed = JSON.parse(key);
						} finally {
						}
						if (parsed && parsed.oauth_token_secret && parsed.oauth_token) return false;
					});
					if (parsed && parsed.oauth_token_secret && parsed.oauth_token) {
						resolve(parsed);
					} else {
						reject("token not found in response");
					}
				}
			});
		});
	}
};