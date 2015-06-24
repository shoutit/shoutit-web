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
				if (error || !res.ok) {
					this.dispatch(consts.LOAD_CONVERSATIONS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_CONVERSATIONS_SUCCESS, {
						res: res.body
					});
				}
			}.bind(this));
	},

	loadMoreConversations(before) {
		this.dispatch(consts.LOAD_MORE_CONVERSATIONS, {
			before
		});

		client.loadMoreConversations({
			before
		}).end(function (error, res) {
			if (error || !res.ok) {
				this.dispatch(consts.LOAD_MORE_CONVERSATIONS_FAILED, {
					error
				});
			} else {
				this.dispatch(consts.LOAD_MORE_CONVERSATIONS_SUCCESS, {
					before,
					res: res.body
				});
			}
		}.bind(this));
	},

	loadConversation(id) {
		this.dispatch(consts.LOAD_CONVERSATION, {
			id
		});

		client.loadMessages(id)
			.end(function (error, res) {
				if (error || !res.ok) {
					this.dispatch(consts.LOAD_CONVERSATION_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_CONVERSATION_SUCCESS, {
						id,
						res: res.body
					});
				}
			}.bind(this));
	},

	loadMoreConversation(id, before) {
		this.dispatch(consts.LOAD_MORE_CONVERSATION, {id, before});

		client.loadMoreMessages(id, {before}).end(function (error, res) {
			if (error || !res.ok) {
				this.dispatch(consts.LOAD_MORE_CONVERSATION_FAILED, {id, before, error});
			} else {
				this.dispatch(consts.LOAD_MORE_CONVERSATION_SUCCESS, {id, before, res: res.body});
			}
		}.bind(this));
	},

	deleteConversation(id) {
		this.dispatch(consts.DELETE_CONVERSATION, {
			id
		});

		client.deleteConversation(id)
			.end(function (error, res) {
				if (error || !res.ok) {
					this.dispatch(consts.DELETE_CONVERSATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.DELETE_CONVERSATION_SUCCESS, {
						id,
						res: res.body
					});
				}
			}.bind(this));
	},


	readConversation(id) {
		this.dispatch(consts.READ_CONVERSATION, {id});

		client.readConversation(id)
			.end(function (error) {
				if (error || !res.ok) {
					this.dispatch(consts.READ_CONVERSATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.READ_CONVERSATION_SUCCESS, {
						id
					});
				}
			}.bind(this));
	},

	unreadConversation(id) {
		this.dispatch(consts.UNREAD_CONVERSATION, {id});

		client.unreadConversation(id).end(function (error) {
			if (error || !res.ok) {
				this.dispatch(consts.UNREAD_CONVERSATION_FAILED, {id, error});
			} else {
				this.dispatch(consts.UNREAD_CONVERSATION_SUCCESS, {id});
			}
		}.bind(this));
	},

	replyConversation(id, message) {
		this.dispatch(consts.REPLY_CONVERSATION, {id, message});

		client.replyConversation(id, message).end(function (error, res) {
			if (error || !res.ok) {
				this.dispatch(consts.REPLY_CONVERSATION_FAILED, {id, message, error});
			} else {
				this.dispatch(consts.REPLY_CONVERSATION_SUCCESS, {id, res: res.body});
			}
		}.bind(this));
	},

	deleteMessage(id, conId) {
		this.dispatch(consts.DELETE_MESSAGE, {id, conId});

		client.deleteMessage(id).end(function (error) {
			if (error || !res.ok) {
				this.dispatch(consts.DELETE_MESSAGE_FAILED, {id, conId, error});
			} else {
				this.dispatch(consts.DELETE_MESSAGE_SUCCESS, {id, conId});
			}
		}.bind(this));
	},

	newMessage(message) {
		this.dispatch(consts.NEW_MESSAGE, {message});
	},

	messageDraftChange(field, value) {
		this.dispatch(consts.MESSAGE_DRAFT_CHANGE, {
			field, value
		});
	}

};
