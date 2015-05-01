/**
 * Created by Philip on 10.04.2015.
 */
var plan = require('flightplan');

var tmpDir = 'shoutit-web-' + new Date().getTime();

plan.local(['shrink', 'default'], function(local) {
	local.exec('npm shrinkwrap');
});

// run commands on localhost
plan.local(['build', 'default'], function (local) {
	local.log('Run gulp build and webpack bundle');
	local.exec('gulp build');
	local.exec('webpack --config=webpack.config.mini.js');

	local.log('Copy files to remote hosts');
	local.exec('git add app/public/main.js');
	var filesToCopy = local.exec('git ls-files', {silent: true});
	local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on the target's remote hosts
plan.remote(['update-shoutit', 'default'], function (remote) {
	remote.log('Move folder to web root');
	remote.cp('-R /tmp/' + tmpDir + ' /var/www/');
	remote.chown('www-data -R /var/www/' + tmpDir);
	remote.chmod('u+rx -R /var/www/' + tmpDir);
	remote.rm('-rf /tmp/' + tmpDir);

	remote.log('Stop application to use memory for npm install.');
	remote.exec('pm2 stop shoutit-web', {failsafe: true});

	remote.log('Install dependencies');
	remote.exec('npm --production --prefix /var/www/' + tmpDir + ' install /var/www/' + tmpDir, {failsafe: true});

	remote.log('Reload application');
	remote.ln('-snf /var/www/' + tmpDir + ' /var/www/shoutit-web');
	remote.chown('www-data -R /var/www/shoutit-web');
	remote.chmod('u+rx -R /var/www/shoutit-web');
	remote.exec('pm2 startOrReload /var/www/shoutit-web.json');
});
