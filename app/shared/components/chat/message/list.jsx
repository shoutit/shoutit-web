import React from 'react';

import {Col} from 'react-bootstrap';

import MessageListTitle from './title.jsx';
import MessageListBody from './body.jsx';
import MessageListInput from './input.jsx';

export default React.createClass({
	displayName: "MessageList",

	render() {
		if (this.props.conversation) {
			let conversation = this.props.conversation,
				user = conversation.users[1];

			if (conversation.messages) {
				return (
					<Col xs={12} md={12} className="chat-right">
						<MessageListTitle name={user.name}/>
						<MessageListBody
							me={this.props.me}
							users={conversation.users}
							messages={conversation.messages}
							onLoadMoreMessagesClicked={this.props.onLoadMoreMessagesClicked}/>
						<MessageListInput
							onTextChange={this.props.onTextChange}
							text={this.props.draft.text}
							onReplyClicked={this.props.onReplyClicked}
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
	}
});
