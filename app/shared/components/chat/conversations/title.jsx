import React from 'react';

export default React.createClass({
	displayName: "ConversationListTitle",

	render() {
		return (
			<div className="title-chat">
				<h4>{"Inbox (" + this.props.unreadCount + ")" }</h4>
			</div>
		);
	}
});
