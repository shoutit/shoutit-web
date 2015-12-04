import request from 'superagent';

const PREFIX = "/api/shouts";
const IMG_REMOVE_ENDPOINT = "/services/image_remove";

export default {
	list(query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	},

	getRelatedShouts(shoutId) {
		return request
			.get(PREFIX + '/' + shoutId + '/related');
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

	remove(fileName) {
		return request
			.post(IMG_REMOVE_ENDPOINT)
			.send({shout_image: fileName});
	},

	reply(shoutId, message) {
		return request.post(PREFIX + '/' + shoutId + '/reply')
			.send(message);
	}
};
