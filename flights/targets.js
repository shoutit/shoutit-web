/**
 * Created by Philip on 10.04.2015.
 */

var plan = require('flightplan');

plan.target('dev-old', {
	host: 'web.shoutit.com',
	username: 'root',
	agent: process.env.SSH_AUTH_SOCK,
	privateKey: "E:\\shoutit\\private_key_shoutit.pem"
});

plan.target('dev', {
	host: 'dev.www.shoutit.com',
	username: 'root',
	agent: process.env.SSH_AUTH_SOCK,
	privateKey: "E:\\shoutit\\private_key_shoutit.pem"
});

plan.target('production', [
	{
		host: 'node-01.www.shoutit.com',
		username: 'root',
		agent: process.env.SSH_AUTH_SOCK,
		privateKey: "E:\\shoutit\\private_key_shoutit.pem"
	}
]);
