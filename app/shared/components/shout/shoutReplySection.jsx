import React from 'react';
import {Link} from 'react-router';
import {Col} from 'react-bootstrap';

import ReplyInput from '../chat/message/input.jsx';

export default React.createClass({
	displayName: "ShoutReplySection",

	propTypes: {
		shout: React.PropTypes.object,
		user: React.PropTypes.string,
		onReplyTextChange: React.PropTypes.func,
		onReplySendClicked: React.PropTypes.func,
		replyDrafts: React.PropTypes.object
	},

	render() {
		let content;

		if (this.props.shout && this.props.shout.id) {
			if (this.props.user) {
				if(this.props.user !== this.props.shout.user.username) {
					let draft = this.props.replyDrafts[this.props.shout.id];

					content = (
						<ReplyInput
							onTextChange={this.props.onReplyTextChange}
							onReplyClicked={this.props.onReplySendClicked}
							text={draft ? draft.text : ""}
							/>
					);
				} else {
					content = (
						<h4>
							This is your shout. You cannot reply to it.
						</h4>
					);
				}
			} else {
				content = (
					<h4>
						<Link to="login">Login</Link> to reply to this shout.
					</h4>
				);
			}
		}

		return (
			<Col xs={12} md={12} className="section-12">
				Reply to the creator of this shout:
				{content}
			</Col>
		);
	}
});
