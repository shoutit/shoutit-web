import React from 'react';

import ConversationItem from './conversation.jsx';

export default React.createClass({
	displayName: "ConversationListBody",

	render() {
		if (this.props.conversations) {
			let conversationElements = this.props.conversations.map((conversation) => {
				return (
					<ConversationItem
						onClick={this.onConversationClicked(conversation.id)}
						key={"con-list-" + conversation.id}
						active={this.props.selected === conversation.id}
						conversation={conversation}/>
				);
			});

			return (
				<ul>
					{conversationElements}
				</ul>
			);
		} else {
			return (
				<h5>Loading conversations...</h5>
			);
		}
	},

	onConversationClicked(id) {
		return function () {
			this.props.onSelect(id);
		}.bind(this);
	}
});
