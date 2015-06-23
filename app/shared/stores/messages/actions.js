/**
 * Created by Philip on 22.06.2015.
 */

import consts from './consts';
import client from './client';

export default {
	loadConversations() {
		this.dispatch(consts.LOAD_CONVERSATIONS);

		client.loadConversations()
			.end(function (error, res) {
				if (error) {
					this.dispatch(consts.LOAD_CONVERSATIONS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_CONVERSATIONS_SUCCESS, {
						res
					});
				}
			});
	},

	loadMoreConversations(before) {
		this.dispatch(consts.LOAD_MORE_CONVERSATIONS, {
			before
		});

		client.loadMoreConversations({
			before
		}).end(function (error, res) {
			if (error) {
				this.dispatch(consts.LOAD_MORE_CONVERSATIONS_FAILED, {
					error
				});
			} else {
				this.dispatch(consts.LOAD_MORE_CONVERSATIONS_SUCCESS, {
					before, res
				});
			}
		});
	},

	loadConversation(id) {
		this.dispatch(consts.LOAD_CONVERSATION, {
			id
		});

		client.loadConversations(id)
			.end(function (error, res) {
				if (error) {
					this.dispatch(consts.LOAD_CONVERSATION_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_CONVERSATION_SUCCESS, {
						id, res
					});
				}
			});
	},

	loadMoreConversation(id, before) {
		this.dispatch(consts.LOAD_MORE_CONVERSATION, {id, before});

		client.loadMoreMessages(id, {before}).end(function (error, res) {
			if (error) {
				this.dispatch(consts.LOAD_MORE_CONVERSATION_FAILED, {id, before, error});
			} else {
				this.dispatch(consts.LOAD_MORE_CONVERSATION_SUCCESS, {id, before, res});
			}
		});
	},

	deleteConversation(id) {
		this.dispatch(consts.DELETE_CONVERSATION, {
			id
		});

		client.deleteConversation(id)
			.end(function (error, res) {
				if (error) {
					this.dispatch(consts.DELETE_CONVERSATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.DELETE_CONVERSATION_SUCCESS, {
						id, res
					});
				}
			});
	},


	readConversation(id) {
		this.dispatch(consts.READ_CONVERSATION, {id});

		client.readConversation(id)
			.end(function (error) {
				if (error) {
					this.dispatch(consts.READ_CONVERSATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.READ_CONVERSATION_SUCCESS, {
						id
					});
				}
			});
	},

	unreadConversation(id) {
		this.dispatch(consts.UNREAD_CONVERSATION, {id});

		client.unreadConversation(id).end(function (error) {
			if (error) {
				this.dispatch(consts.UNREAD_CONVERSATION_FAILED, {id, error});
			} else {
				this.dispatch(consts.UNREAD_CONVERSATION_SUCCESS, {id});
			}
		});
	},

	replyConversation(id, message) {
		this.dispatch(consts.REPLY_CONVERSATION, {id, message});

		client.replyConversation(id, message).end(function (error, res) {
			if (error) {
				this.dispatch(consts.REPLY_CONVERSATION_FAILED, {id, message, error});
			} else {
				this.dispatch(consts.REPLY_CONVERSATION_SUCCESS, {id, res});
			}
		});
	},

	deleteMessage(id, conId) {
		this.dispatch(consts.DELETE_MESSAGE, {id, conId});

		client.deleteMessage(id).end(function (error) {
			if (error) {
				this.dispatch(consts.DELETE_MESSAGE_FAILED, {id, conId, error});
			} else {
				this.dispatch(consts.DELETE_MESSAGE_SUCCESS, {id, conId});
			}
		});
	},

	newMessage(message) {
		this.dispatch(consts.NEW_MESSAGE, {message});
	}

};
