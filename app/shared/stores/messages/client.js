/**
 * Created by Philip on 22.06.2015.
 */

import request from 'superagent';

const MESSAGES_PREFIX = "/api/messages";
const CONVERSATIONS_PREFIX = "/api/conversations";

export default {
	loadConversations() {
		return request.get(CONVERSATIONS_PREFIX);
	},

	loadMoreConversations(query) {
		return this.loadConversations().query(query);
	},

	loadMessages(id) {
		return request.get(CONVERSATIONS_PREFIX + '/' + id + '/messages');
	},

	loadMoreMessages(id, query) {
		return this.loadMessages(id).query(query);
	},

	deleteMessage(id) {
		return request.del(MESSAGES_PREFIX + '/' + id);
	},

	readConversation(id) {
		return request.post(CONVERSATIONS_PREFIX + '/' + id + '/read');
	},

	unreadConversation(id) {
		return request.del(CONVERSATIONS_PREFIX + '/' + id + '/read');
	},

	replyConversation(id, message) {
		return request.post(CONVERSATIONS_PREFIX + '/' + id + '/reply')
			.send(message);
	}
};
