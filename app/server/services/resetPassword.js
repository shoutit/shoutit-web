var request = require('superagent'),
	url = require('url');

var ENDPOINT_SERVER = process.env.API_URL || 'http://dev-api-shoutit-com-qm7w6bwy42b2.runscope.net/v2/',
	SETPASS_ENDPOINT = 'auth/set_password';

function handleGet(req, res) {
	res.render('reset_password', {reset_token: req.query.reset_token});
}

function handlePost(req, res) {
	var api = url.resolve(ENDPOINT_SERVER, SETPASS_ENDPOINT);

	request 
		.post(api)
		.type('json')
		.accept('json')
		.send(req.body)
		.end(function(err,resp) {
			if(err) {
				console.log(err);
			} else {
				console.log(resp.body);
				res.render('reset_password', {reset_token: req.body.reset_token,resp: resp.body});
			}
		});
}


module.exports = {
	get: handleGet,
	post: handlePost
};