import React from 'react';

import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import {Col} from 'react-bootstrap';

import ConversationList from './conversations/list.jsx';
import MessageList from './message/list.jsx';

import findIndex from 'lodash/array/findIndex';

export default React.createClass({
	displayName: "Chat",
	mixins: [new FluxMixin(React), new StoreWatchMixin('messages')],

	statics: {
		fetchData(client, session, params) {
			return client.conversations().load(session);
		}
	},

	contextTypes: {
		router: React.PropTypes.func
	},

	getStateFromFlux() {
		let store = this.getFlux().store('messages');
		return store.getState();
	},

	render() {
		let activeConversation = this.getActiveConversation();

		return (
			<div className="chat">
				<Col xs={12} md={4} className="chat-left-padding">
					<ConversationList
						onSelect={this.onSelectConversation}
						conversations={this.state.conversations}
						selectedConversation={this.state.selectedConversation}/>
				</Col>
				<Col xs={12} md={8} className="chat-left-padding">
					<MessageList
						me={this.state.me}
						conversation={activeConversation}
						onTextChange={this.onTextChange}
						onReplyClicked={this.onReplyClicked}
						draft={this.state.draft}
						onLoadMoreMessagesClicked={this.onLoadMoreMessagesClicked}
						/>
				</Col>
			</div>
		);
	},

	onLoadMoreMessagesClicked(before) {
		this.getFlux().actions.loadMoreConversation(this.getActiveConversation().id, before);
	},

	getActiveConversation() {
		return this.context.router.getCurrentParams().chatId ?
			this.state.conversations[findIndex(this.state.conversations, 'id', this.state.selectedConversation)] :
			null;
	},

	onSelectConversation(conId) {
		this.context.router.transitionTo("chat", {chatId: conId});
	},

	onTextChange(e) {
		this.getFlux().actions.messageDraftChange("text", e.target.value);
	},

	onReplyClicked() {
		this.getFlux().actions.replyConversation(this.getActiveConversation().id, this.state.draft);
	},

	componentDidUpdate() {
		let activeConversation = this.getActiveConversation();

		if (!this.state.loading && activeConversation && !activeConversation.messages) {
			this.getFlux().actions.loadConversation(activeConversation.id);
		}
	},

	componentDidMount() {
		if(!this.state.conversations) {
			this.getFlux().actions.loadConversations();
		}
	}
});
