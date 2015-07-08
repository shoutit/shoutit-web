import request from 'superagent';

const PREFIX = "/api/shouts";

export default {
	list(query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	},
	get(shoutId) {
		return request
			.get(PREFIX + '/' + shoutId);
	},
	create(shout) {
		return request
			.post(PREFIX + '/')
			.send(shout);
	},

	reply(shoutId, message) {
		return request.post(PREFIX + '/' + shoutId + '/reply')
			.send(message);
	}
};
