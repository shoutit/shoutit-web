/**
 * Created by Philip on 10.04.2015.
 */
var plan = require('flightplan'),
	path = require('path');

var sourcesFolder = "/root/sources",
	nodeVersion = "v0.12.2",
	nodePackage = "node-" + nodeVersion,
	nodeDownloadUrl = 'http://nodejs.org/dist/' + nodeVersion + '/' + nodePackage + '.tar.gz';

plan.local(['upgrade', 'setup'], function (remote) {
	remote.exec('apt-get update');
	remote.exec('apt-get upgrade');
});

plan.remote(['install-node', 'setup'], function (remote) {
	remote.log("Installing nodejs");
	remote.exec('apt-get -y update');
	remote.exec('apt-get -y install build-essential python');
	remote.mkdir(sourcesFolder, {failsafe: true});
	remote.with('cd ' + sourcesFolder, function () {
		remote.exec('wget ' + nodeDownloadUrl);
		remote.exec('tar xzf ' + nodePackage + '.tar.gz');
		remote.exec('./configure');
		remote.exec('make');
		remote.exec('make install');
	});
	remote.exec('node -v');
	remote.exec('npm -v');
	remote.log("Finished Installing nodejs");
});


plan.remote(['install-pm2', 'setup'], function (remote) {
	remote.log('Installing pm2 process manager');
	remote.exec('npm install -g pm2');
	remote.exec('pm2 list');
	remote.exec('pm2 startup debian');
	remote.log("Finished setting up pm2");
});

var nginxConfigFile = path.join(__dirname, 'nginx.conf');

plan.remote(['install-nginx', 'setup'], function (remote) {
	remote.log("Installing nginx");
	remote.exec('apt-get -y update');
	remote.exec('apt-get -y install nginx');
	remote.log("Finished Installing nginx");
});

plan.local(['send-config-nginx', 'setup'], function (local) {
	local.log('Send Nginx init script and config file to remote');
	local.transfer(nginxConfigFile, '/etc/nginx/nginx.conf');
});

plan.remote(['config-nginx', 'setup'], function (remote) {
	remote.log('Finishing Config');
	remote.chown('root:root /etc/nginx/nginx.conf');
	remote.exec('update-rc.d nginx enable');
	remote.exec('service nginx start');
	remote.mkdir('/var/www');
});

plan.remote(['add-hosts', 'setup'], function (remote) {
	remote.exec('echo "10.133.197.49 dev.api.shoutit.com" >> /etc/hosts');
	remote.exec('echo "10.133.181.206 api.shoutit.com" >> /etc/hosts');
	remote.exec('echo "10.133.182.83 redis.shoutit.com" >> /etc/hosts');
});

var pm2AppConfig = path.join(__dirname, 'shoutit-web.json');

plan.local(['send-pm2-json','setup'], function (local) {
	local.log('Send pm2 config file to start shoutit-web');
	local.transfer(pm2AppConfig, '/var/www/shoutit-web.json');
});

plan.remote(['restart-shoutit','setup'], function (remote) {
	remote.log('Restarting shoutit Web');
	remote.exec('pm2 startOrRestart /var/www/shoutit-web.json');
});

plan.remote('stop-shoutit', function (remote) {
	remote.log('Stopping shoutit Web');
	remote.exec('pm2 stop shoutit-web');
});

plan.remote('reload-shoutit', function (remote) {
	remote.log('Reloading shoutit-web');
	remote.exec('pm2 reload shoutit-web');
});



