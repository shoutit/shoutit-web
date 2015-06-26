import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import findIndex from 'lodash/array/findIndex';
import find from 'lodash/collection/find';

import {Col} from 'react-bootstrap';

import MessageListTitle from './title.jsx';
import MessageListBody from './body.jsx';
import MessageListInput from './input.jsx';

export default React.createClass({
	displayName: "MessageList",
	mixins: [new FluxMixin(React), new StoreWatchMixin('messages')],

	statics: {
		fetchData(client, session, params) {
			return client.conversations().messages(session, params.chatId);
		}
	},

	getStateFromFlux() {
		return this.getFlux().store('messages').getState();
	},

	render() {
		let conversation = this.getActiveConversation();

		if (conversation) {
			let user = find(conversation.users, function (usr) {
				return usr.id != this.state.me;
			}.bind(this));

			if (conversation.messages) {
				return (
					<Col xs={12} md={12} className="chat-right">
						<MessageListTitle name={user.name}/>
						<MessageListBody
							me={this.state.me}
							messages={conversation.messages}
							onLoadMoreMessagesClicked={this.onLoadMoreMessagesClicked}/>
						<MessageListInput
							onTextChange={this.onTextChange}
							text={this.state.draft.text}
							onReplyClicked={this.onReplyClicked}
							/>
					</Col>
				);
			} else {
				return (
					<Col xs={12} md={12} className="chat-right">
						<MessageListTitle name={user.name}/>
						<h4>Loading messages...</h4>
					</Col>
				);
			}
		} else {
			return (
				<Col xs={12} md={12} className="chat-right">
					<h4>Select a conversation</h4>
				</Col>
			);
		}
	},

	getActiveConversation() {
		return this.props.params && this.props.params.chatId ?
			this.state.conversations[findIndex(this.state.conversations, 'id', this.props.params.chatId)] :
			null;
	},

	onLoadMoreMessagesClicked(before) {
		this.getFlux().actions.loadMoreConversation(this.getActiveConversation().id, before);
	},


	onTextChange(e) {
		this.getFlux().actions.messageDraftChange("text", e.target.value);
	},

	onReplyClicked() {
		this.getFlux().actions.replyConversation(this.getActiveConversation().id, this.state.draft);
	},

	componentDidMount() {
		this.loadMessages();
	},

	componentDidUpdate() {
		this.loadMessages();
	},

	loadMessages() {
		let activeConversation = this.getActiveConversation();

		if (!this.state.loading && activeConversation && !activeConversation.messages) {
			this.getFlux().actions.loadConversation(activeConversation.id);
		}
	}
});
