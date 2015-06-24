import React from 'react';
import {Col} from 'react-bootstrap';
import classnames from 'classnames';

import {Image} from '../../helper';

export default React.createClass({
	displayName: "ConversationListItem",

	render() {
		let itemClasses = classnames({
			"chat-active": this.props.active
		});

		let unreadConClasses = classnames({
			"small-circle2": true,
			"active": this.props.conversation.unread_messages_count > 0
		});

		let user = this.props.conversation.users[1];

		let lastMessage = this.props.conversation.last_message;

		return (
			<li className={itemClasses} onClick={this.props.onClick}>
				<Col xs={2} md={2} className="chat-ul-left">
					<Image infix="user" size="small" src={user.image}/>
				</Col>
				<Col xs={10} md={10} className="chat-ul-right">
					<a>
						<span className="chat-person">
							{user.name}
						</span>
						<span className={unreadConClasses}></span>
						<p>
							{lastMessage.text}
						</p>
					</a>
				</Col>
			</li>
		);
	}
})
