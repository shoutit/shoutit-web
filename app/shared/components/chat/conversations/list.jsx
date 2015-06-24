import React from 'react';

import {Col} from 'react-bootstrap';

import ConversationListTitle from './title.jsx';
import ConversationListBody from './body.jsx';
import {Clear} from '../../helper';

export default React.createClass({
	displayName: "ConversationList",

	render() {
		return (
			<Col xs={12} md={12} className="chat-left">
				<ConversationListTitle unreadCount={this.getUnreadConversationCount()}/>
				<Clear/>
				<ConversationListBody {...this.props}/>
			</Col>
		);
	},

	getUnreadConversationCount() {
		let count = 0;
		if (this.props.conversations) {
			this.props.conversations.forEach(function (con) {
				if (con.unread_messages_count > 0) {
					count++;
				}
			});
		}
		return count;
	}
});
