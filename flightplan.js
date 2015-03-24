/**
 * Created by Philip on 18.03.2015.
 */

var plan = require('flightplan');

plan.target('production', {
	host: 'web.shoutit.com',
	username: 'root',
	agent: process.env.SSH_AUTH_SOCK,
	privateKey: "E:\\shoutit\\private_key_shoutit.pem"
});

var tmpDir = 'shoutit-web-' + new Date().getTime();

// run commands on localhost
plan.local(function (local) {
	local.log('Run build');
	local.exec('gulp build');

	local.log('Copy files to remote hosts');
	var filesToCopy = local.exec('git ls-files', {silent: true});
	// rsync files to all the target's remote hosts
	local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on the target's remote hosts
plan.remote(function (remote) {
	remote.log('Move folder to web root');
	remote.cp('-R /tmp/' + tmpDir + ' /var/www/');
	remote.chown('nginx -R /var/www/' + tmpDir);
	remote.chmod('u+rx -R /var/www/' + tmpDir);
	remote.rm('-rf /tmp/' + tmpDir);

	remote.log('Install dependencies');
	remote.exec('npm --production --prefix /var/www/' + tmpDir + ' install /var/www/' + tmpDir,  {failsafe: true});

	remote.log('Reload application');
	remote.ln('-snf /var/www/' + tmpDir + ' /var/www/shoutit-web');
	remote.chown('nginx -R /var/www/shoutit-web');
	remote.chmod('u+rx -R /var/www/shoutit-web');
	remote.exec('pm2 reload shoutit-web');
});