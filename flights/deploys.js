/**
 * Created by Philip on 10.04.2015.
 */
var plan = require('flightplan');

var tmpDir = 'shoutit-web-' + new Date().getTime();

plan.local(['shrink', 'default'], function(local) {
	local.exec('npm shrinkwrap');
});

// run commands on localhost: gulp build and webpack
plan.local(['build', 'default'], function (local) {
	local.log('Run gulp build and webpack bundle');
	local.exec('gulp build');
    var target = local._context.target;
    var webpackOpts = target === 'production' ? '' : '';
    local.exec('webpack ' + webpackOpts);
});


// run commands on localhost: transfer files to remote
plan.local(['transfer', 'default'], function (local) {
	local.log('Copy files to remote hosts');

	// Add css, img and main.js to git
	local.exec('git add -f app/public/main.js -f app/public/css/* -f app/public/img/*');

	// Create list of files to be transferred and transfer them
	var filesToCopy = local.exec('git ls-files', {silent: true});
	local.transfer(filesToCopy, '/tmp/' + tmpDir);

	// Not really :D remove them now
	local.exec('git rm -f app/public/main.js -f -r app/public/css -f -r app/public/img');
});


// run commands on the target's remote hosts
plan.remote(['update-shoutit', 'default'], function (remote) {
	remote.log('Move folder to web root');
	remote.cp('-R /tmp/' + tmpDir + ' /var/www/');
	remote.chown('www-data -R /var/www/' + tmpDir);
	remote.chmod('u+rx -R /var/www/' + tmpDir);
	remote.rm('-rf /tmp/' + tmpDir);

	if(plan.runtime.options.stopPM2) {
		remote.log('Stop application to use memory for npm install.');
		remote.exec('pm2 stop shoutit-web', {failsafe: true});
	}

	remote.log('Install dependencies');
	remote.exec('npm cache clean');
	remote.exec('npm --production --prefix /var/www/' + tmpDir + ' install /var/www/' + tmpDir, {failsafe: true});

	remote.log('Reload application');
	remote.ln('-snf /var/www/' + tmpDir + ' /var/www/shoutit-web');
	remote.chown('www-data -R /var/www/shoutit-web');
	remote.chmod('u+rx -R /var/www/shoutit-web');
	remote.exec('pm2 startOrReload /var/www/shoutit-web.json');
});
