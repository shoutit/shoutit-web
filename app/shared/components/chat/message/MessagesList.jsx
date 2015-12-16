import React from 'react';
import {Link} from 'react-router';

import MessageItem from './MessageItem.jsx';

export default React.createClass({
	displayName: "MessagesList",

	render() {
		return (
			<div ref="chatContent" className="cnt-chat">
				{this.renderLoadMoreButton()}
				{this.renderBlocks()}
			</div>
		);
	},

	renderLoadMoreButton() {
		if (this.props.format && this.props.format === "flat") {
			return (
				<h5>
					<Link to="messages" params={{chatId: this.props.conId}}>See complete conversation.</Link>
				</h5>
			);
		} else {
			return (
				<h5 onClick={this.onLoadMoreMessages}>Load older messages</h5>
			);
		}
	},

	onLoadMoreMessages() {
		if (this.props.messages) {
			let firstMessage = this.props.messages[0];
			this.props.onLoadMoreMessagesClicked(firstMessage.created_at);
		}
	},

	renderBlocks() {
		let me = this.props.me,
			blocks = [],
			currentBlock;

		this.props.messages.forEach(function (message) {
			if (!currentBlock || currentBlock.user.username !== message.user.username) {
				if (currentBlock) {
					blocks.push(currentBlock);
				}

				currentBlock = {
					user: message.user,
					messages: [message],
					from: message.user.username !== me,
					to: message.user.username === me
				};
			} else {
				currentBlock.messages.push(message);
			}
		});
		if (currentBlock) {
			currentBlock.last = true;
			blocks.push(currentBlock);
		}

		return blocks.map(function (block, i) {
			return (<MessageItem key={"msg-block-" + i} {...block}/>);
		});
	},

	componentDidMount() {
		this.scrollToBottom();
	},

	scrollToBottom() {
		let node = React.findDOMNode(this.refs.chatContent);

		if (node.scrollTop + node.offsetHeight + 1 < node.scrollHeight) {
			node.scrollTop = node.scrollHeight;
		}
	},

	componentDidUpdate() {
		this.scrollToBottom();
	}
});
