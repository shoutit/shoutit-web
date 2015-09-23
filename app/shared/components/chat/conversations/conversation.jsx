import React from 'react';
import {Col} from 'react-bootstrap';
import {Link} from 'react-router';
import classnames from 'classnames';

import ConversationImage from './conversationImage.jsx';

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

		let opponents = this.props.conversation.users.filter(function(user) {
			return user.username !== this.props.me;
		}.bind(this));

		let names = opponents.map(function(user) {
			return user.name;
		}).join(", ");

		let lastMessage = this.props.conversation.last_message;

		return (
			<li className={itemClasses} onClick={this.props.onClick}>
				<ConversationImage me={this.props.me} conversation={this.props.conversation}/>
				<Col xs={10} md={10} className="chat-ul-right">
					<a>
						<span className="chat-person">
							{names}
						</span>
						<span className={unreadConClasses}></span>
						{this.getAbout()}
						<p>
							{lastMessage.text}
						</p>
					</a>
				</Col>
			</li>
		);
	},

	getAbout() {
		if (this.props.conversation.about) {
            let shout = this.props.conversation.about;
			return (
                <Link to="shout" params={{
                        shoutId: shout.id,
                        location: shout.location.city,
                        title: encodeURIComponent(shout.title.replace(/\s+/g, '-'))
                }}>
                    {shout.title}
                </Link>
			)
		}
	}
});
