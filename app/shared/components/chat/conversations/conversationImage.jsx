import React from 'react';
import {Col} from 'react-bootstrap';
import find from 'lodash/collection/find';

import Image from '../../helper/image.jsx';

export default React.createClass({
	displayName: "ConversationImage",

	propTypes: {
		me: React.PropTypes.string,
		conversation: React.PropTypes.object
	},

	render() {
		let opts = this.getRenderOpts();

		return (
			<Col xs={2} md={2} className="chat-ul-left">
				<Image infix={opts.infix} size="small" src={opts.src}/>
			</Col>
		);
	},

	getRenderOpts()  {
		let renderOpts = {};
		let conversation = this.props.conversation;
		if (conversation.about && conversation.about.thumbnail) {
			renderOpts.infix = "shout";
			renderOpts.src = conversation.about.thumbnail;
		} else {
			let user = find(this.props.conversation.users, function (usr) {
				return usr.id != this.props.me;
			}.bind(this));

			if (user) {
				renderOpts.infix = "user";
				renderOpts.src = user.image || "";
			}

		}

		return renderOpts;
	}
});
