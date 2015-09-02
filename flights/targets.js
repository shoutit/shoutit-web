/**
 * Created by Philip on 10.04.2015.
 */

var plan = require('flightplan'),
    utils = require('../app/shared/utils'),
    path = require('path');


plan.target('dev-old', {
    host: 'web.shoutit.com',
    username: 'root',
    agent: process.env.SSH_AUTH_SOCK,
    privateKey: path.join(utils.getUserHome(), ".ssh", "id_rsa")
});

plan.target('dev', {
    host: 'dev.www.shoutit.com',
    username: 'root',
    agent: process.env.SSH_AUTH_SOCK,
    privateKey: path.join(utils.getUserHome(), ".ssh", "id_rsa")
}, {
    stopPM2: true
});

plan.target('production', [
    {
        host: 'node-01.www.shoutit.com',
        username: 'root',
        agent: process.env.SSH_AUTH_SOCK,
        privateKey: path.join(utils.getUserHome(), ".ssh", "id_rsa")
    }
]);

plan.remote(['test'], function (remote) {
    remote.exec('uname -a');
});
