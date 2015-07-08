/**
 * Created by Philip on 22.06.2015.
 */

import Fluxxor from 'fluxxor';
import findIndex from 'lodash/array/findIndex';
import remove from 'lodash/array/remove';

import consts from './consts';

const LOG_TAG = "[Messages-Store]";

let MessagesStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			me: null,
			loading: false,
			conversations: null,
			draft: {
				text: ""
			}
		};

		if (props.chat) {
			this.state.conversations = props.chat.results;

			if (props.messages) {
				this.state.conversations[this.getIndex(props.params.chatId)].messages = props.messages.results;
			}
		}

		if (props.loggedUser) {
			this.state.me = props.loggedUser.username;
		}

		this.bindActions(
			consts.LOAD_CONVERSATIONS, this.onLoadConversations,
			consts.LOAD_CONVERSATIONS_SUCCESS, this.onLoadConversationsSuccess,
			consts.LOAD_CONVERSATIONS_FAILED, this.onRequestFailed("load conversations failed"),

			consts.LOAD_MORE_CONVERSATIONS, this.onLoadMoreConversations,
			consts.LOAD_MORE_CONVERSATIONS_SUCCESS, this.onLoadMoreConversationsSuccess,
			consts.LOAD_MORE_CONVERSATIONS_FAILED, this.onRequestFailed("load more conversations failed"),

			consts.LOAD_CONVERSATION, this.onLoadConversation,
			consts.LOAD_CONVERSATION_SUCCESS, this.onLoadConversationSuccess,
			consts.LOAD_CONVERSATION_FAILED, this.onRequestFailed("load conversation failed"),

			consts.LOAD_MORE_CONVERSATION, this.onLoadMoreConversation,
			consts.LOAD_MORE_CONVERSATION_SUCCESS, this.onLoadMoreConversationSuccess,
			consts.LOAD_MORE_CONVERSATION_FAILED, this.onRequestFailed("load conversation failed"),

			consts.DELETE_CONVERSATION, this.onDeleteConversation,
			consts.DELETE_CONVERSATION_SUCCESS, this.onDeleteConversationSuccess,
			consts.DELETE_CONVERSATION_FAILED, this.onRequestFailed("delete conversation failed"),

			consts.READ_CONVERSATION, this.onReadConversation,
			consts.READ_CONVERSATION_SUCCESS, this.onReadConversationSuccess,
			consts.READ_CONVERSATION_FAILED, this.onRequestFailed("read conversation failed"),

			consts.UNREAD_CONVERSATION, this.onUnreadConversation,
			consts.UNREAD_CONVERSATION_SUCCESS, this.onUnreadConversationSuccess,
			consts.UNREAD_CONVERSATION_FAILED, this.onRequestFailed("unread conversation failed"),

			consts.REPLY_CONVERSATION, this.onReplyConversation,
			consts.REPLY_CONVERSATION_SUCCESS, this.onReplyConversationSuccess,
			consts.REPLY_CONVERSATION_FAILED, this.onRequestFailed("reply conversation failed"),

			consts.DELETE_MESSAGE, this.onDeleteMessage,
			consts.DELETE_MESSAGE_SUCCESS, this.onDeleteMessageSuccess,
			consts.DELETE_MESSAGE_FAILED, this.onRequestFailed("delete message failed"),

			consts.NEW_MESSAGE, this.onNewMessage,
			consts.MESSAGE_DRAFT_CHANGE, this.onDraftChange
		);
	},

	onNewMessage({message}) {
		let conIndex = this.getIndex(message.conversation_id);

		if (conIndex !== -1) {
			let conversation = this.state.conversations[conIndex];
			if (!conversation.messages) {
				conversation.messages = [];
			}
			conversation.messages.push(message);
			conversation.last_message = message;
			conversation.messages_count += 1;
			this.emit("change");
		}
	},

	onLoadConversations() {
		this.state.loading = true;
		this.emit("change");
	},

	saveConversations(res) {
		if (res.results && res.results.length) {
			this.state.conversations = res.results;
		}
	},

	onLoadConversationsSuccess({res}) {
		this.saveConversations(res);
		this.state.loading = false;
		this.emit("change");
	},

	onLoadMoreConversations() {
		this.state.loading = true;
		this.emit("change");
	},

	onLoadMoreConversationsSuccess({before, res}) {
		res.results.forEach(function (conversation) {
			var index = this.getIndex(conversation.id);
			if (index >= 0) {
				this.state.conversations[index] = conversation;
			} else {
				this.state.conversations.push(conversation);
			}
		}.bind(this));

		this.state.loading = false;
		this.emit("change");
	},

	onLoadConversation({id}) {
		this.state.loading = true;
		this.emit("change");
	},

	onLoadConversationSuccess({id, res}) {
		let conversation = this.state.conversations[this.getIndex(id)];
		conversation.messages = res.results;

		this.state.loading = false;
		this.emit("change");
	},

	onLoadMoreConversation({id, before}) {
		this.state.loading = true;
		this.emit("change");
	},

	onLoadMoreConversationSuccess({id, before, res}) {
		let conversation = this.state.conversations[this.getIndex(id)];
		Array.prototype.splice.apply(conversation.messages, [0, 0].concat(res.results));

		this.state.loading = false;
		this.emit("change");
	},

	onDeleteConversation({id}) {
		this.state.loading = true;
		this.emit("change");
	},

	onDeleteConversationSuccess({id}) {
		remove(this.state.conversations, "id", id);
		this.state.loading = false;
		this.emit("change");
	},

	onReadConversation({id}) {
		this.state.loading = true;
		this.emit("change");
	},

	onReadConversationSuccess({id}) {
		let conversation = this.state.conversations[this.getIndex(id)];
		conversation.unread_messages_count = 0;
		conversation.messages.forEach(function (message) {
			message.is_read = true;
		});

		this.state.loading = false;
		this.emit("change");
	},

	onUnreadConversation({id}) {
		this.state.loading = true;
		this.emit("change");
	},

	onUnreadConversationSuccess({id}) {
		let conversation = this.state.conversations[this.getIndex(id)];
		conversation.unread_messages_count = conversation.messages.length;
		conversation.messages.forEach(function (message) {
			message.is_read = false;
		});

		this.state.loading = false;
		this.emit("change");
	},

	onReplyConversation({id, message}) {
		this.state.loading = true;
		this.emit("change");
	},

	onReplyConversationSuccess({id, res}) {
		let conversation = this.state.conversations[this.getIndex(id)];
		conversation.messages.push(res);
		conversation.last_message = res;
		conversation.messages_count += 1;

		this.state.draft = {
			text: ""
		};

		this.state.loading = false;
		this.emit("change");
	},

	onDeleteMessage({id}) {
		this.state.loading = true;
		this.emit("change");
	},

	onDeleteMessageSuccess({id, conId}) {
		let conversation = this.getIndex(conId);
		remove(conversation.messages, "id", id);

		this.state.loading = false;
		this.emit("change");
	},

	onDraftChange({field, value}) {
		this.state.draft[field] = value;
		this.emit("change");
	},

	getIndex(conId) {
		return findIndex(this.state.conversations, 'id', conId);
	},

	onRequestFailed(tag) {
		return function ({error}) {
			console.error(LOG_TAG, tag, error);
			this.state.loading = false;
			this.emit("change");
		};
	},

	serialize() {
		return JSON.stringify(this.state);
	},

	hydrate(json) {
		this.state = JSON.parse(json);
	},

	getState() {
		return this.state;
	},

	setMe(user) {
		this.state.me = user.username;
		this.emit("change");
	}
});

export default MessagesStore;
