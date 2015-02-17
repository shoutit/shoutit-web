/**
 * Created by Philip on 12.01.2015.
 */

var OAuth = require('oauth'),
	_ = require('lodash'),
	Promise = require('bluebird');

var oauth = new OAuth.OAuth(
	'http://dev.shoutit.com/oauth/request_token/',
	'http://dev.shoutit.com/oauth/access_token/',
	'shoutit-web',
	'64a542b1-1b2d-8503-6cbb-4cf8cea',
	'1.0',
	null,
	'HMAC-SHA1',
	null,
	{
		"shoutit-client": "web"
	}
);

oauth.setClientOptions({
	requestTokenHttpMethod: 'GET'
});

module.exports = {
	getRequestTokenPromise: function () {
		return new Promise(function (resolve, reject) {
			oauth._performSecureRequest(null, null, 'GET', oauth._requestUrl, {}, null, null, function (error, data) {
				if (error) {
					console.error('request_token_request', error);
					reject(error);
				}
				else {
					var parsed;
					try {
						parsed = JSON.parse(data);
					} finally {
						if (parsed && parsed.oauth_token_secret && parsed.oauth_token) {
							resolve(parsed);
						} else {
							reject("request_token not found in response");
						}
					}
				}
			});
		});
	},

	getAccessTokenGPlusPromise: function (gCode) {
		console.log(gCode);
		return function (requestTokenResult) {
			return new Promise(function (resolve, reject) {
				var body = {
					social_channel_response: {
						code: gCode
					},
					user: {
						location: {
							country: "DE",
							city: "Berlin",
							latitude: 52.552238,
							longitude: 13.445368
						}
					}
				};

				oauth._performSecureRequest(requestTokenResult.oauth_token, requestTokenResult.oauth_token_secret,
					"POST", 'http://dev.shoutit.com/oauth/access_token/gplus/',
					{}, JSON.stringify(body), 'application/json',
					function (error, data, response) {
						if (error) {
							console.error("access2_token_request", error);
							reject(error);
						}
						else {
							var parsed;
							try {
								parsed = JSON.parse(data);
							} catch (e) {
								console.error('parse stuff', e);
								return reject(e);
							} finally {
								if (parsed && parsed.access_token && parsed.access_token_secret) {
									resolve(parsed);
								} else {
									reject("access_token not found in response");
								}
							}
						}
					})
			});
		}
	}
};