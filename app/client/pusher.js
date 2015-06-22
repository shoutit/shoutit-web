/**
 * Created by Philip on 22.06.2015.
 */

let Pusher = require('imports?define=>false!pusher-js');

const LOG_TAG = "[Pusher]";

export default function (APP_KEY, authEndpoint) {

	let pusher = new Pusher(APP_KEY, {
		encrypted: true,
		authEndpoint: authEndpoint
	});

	pusher.connection.bind('error', function (err) {
		if (err.data.code === 4004) {
			console.warn(LOG_TAG, 'detected limit error');
		} else {
			console.warn(LOG_TAG, err);
		}
	});

	pusher.connection.bind('initialized', function () {
		console.log(LOG_TAG, 'initialized');
	});

	pusher.connection.bind('connecting', function () {
		console.log(LOG_TAG, 'connecting');
	});

	pusher.connection.bind('connected', function () {
		console.log(LOG_TAG, 'initialized');
	});

	pusher.connection.bind('unavailable', function () {
		console.log(LOG_TAG, 'unavailable');
	});

	pusher.connection.bind('failed', function () {
		console.log(LOG_TAG, 'failed');
	});

	pusher.connection.bind('disconnected', function () {
		console.log(LOG_TAG, 'disconnected');
	});

	return pusher;
}
