/**
 * Created by Philip on 22.06.2015.
 */

import request from 'superagent';

const PREFIX = '/api/notifications';

export default {
	list(query) {
		return request
			.get(PREFIX + '/')
			.query(query);
	},

	reset() {
		return request
			.post(PREFIX + '/reset');
	},

	read(id) {
		return request
			.post(PREFIX + '/' + id + '/read');
	},

	unread(id) {
		return request
			.del(PREFIX + '/' + id + '/read');
	}
};
