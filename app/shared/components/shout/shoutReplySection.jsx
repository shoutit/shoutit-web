import React from 'react';
import {Link} from 'react-router';
import {Col} from 'react-bootstrap';

import ReplyInput from '../chat/message/input.jsx';

export default React.createClass({
	displayName: "ShoutReplySection",

	propTypes: {
		shout: React.PropTypes.object,
		user: React.PropTypes.object,
		onReplyTextChange: React.PropTypes.func,
		onReplySendClicked: React.PropTypes.func,
		replyDrafts: React.PropTypes.object
	},

	render() {
		let content;

		if (this.props.user) {
			let draft = this.props.replyDrafts[this.props.shout.id];

			content = (
				<ReplyInput
					onTextChange={this.props.onReplyTextChange}
					onReplyClicked={this.props.onReplySendClicked}
					text={draft ? this.draft.message : null}
					/>
			);
		} else {
			content = (
				<h4>
					<Link to="login">Login</Link> to reply to this shout.
				</h4>
			);
		}

		return (
			<Col xs={12} md={8}>
				{content}
			</Col>
		);
	}
});
