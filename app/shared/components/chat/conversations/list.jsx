import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Navigation} from 'react-router';

import {Col} from 'react-bootstrap';

import ConversationListTitle from './title.jsx';
import ConversationListBody from './body.jsx';
import {Clear} from '../../helper';

export default React.createClass({
	displayName: "ConversationList",
	mixins: [new FluxMixin(React), new StoreWatchMixin('messages'), Navigation],

	getStateFromFlux() {
		return this.getFlux().store('messages').getState();
	},

	render() {
		return (
			<Col xs={12} md={12} className="chat-left">
				<ConversationListTitle unreadCount={this.getUnreadConversationCount()}/>
				<Clear/>
				<ConversationListBody {...this.state}
					selected={this.props.params.chatId}
					onSelect={this.onSelectConversation} />
			</Col>
		);
	},

	componentDidMount() {
		if (!this.state.conversations) {
			this.getFlux().actions.loadConversations();
		}
	},

	onSelectConversation(conId) {
		this.transitionTo("messages", {chatId: conId});
	},

	getUnreadConversationCount() {
		let count = 0;
		if (this.state.conversations) {
			this.state.conversations.forEach(function (con) {
				if (con.unread_messages_count > 0) {
					count++;
				}
			});
		}
		return count;
	}
});
