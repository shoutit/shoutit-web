import React from 'react';

import classNames from 'classnames';

import {Image, Icon} from '../../helper';

export default React.createClass({
	displayName: "MessageListBodyBlock",

	render() {
		let blockClasses = classNames({
			"from": this.props.from,
			"to": this.props.to
		});

		let imageClasses = classNames({
			"from-img": this.props.from,
			"to-img": this.props.to
		});

		let msgClasses = classNames({
			"from-msg": this.props.from,
			"to-msg": this.props.to
		});

		return (
			<div className={blockClasses}>
				<div className={imageClasses}>
					<Image infix="user" size="small" src={this.props.user.image}/>
				</div>
				<div className={msgClasses}>
					{this.renderMessages()}
					{this.renderMui()}
				</div>
			</div>
		);
	},

	renderMessages() {
		let messages = this.props.messages;
		return messages.map(function (message, i) {
			return (<p
				key={"msg-block-msg-" + i}>{message.text}</p>);
		});
	},

	renderMui() {
		if (this.props.from) {
			return (
				<Icon className="muichat" name="mui-chat"/>
			);
		} else if (this.props.to) {
			return (
				<Icon className="muichat-to" name="chat-mui1"/>
			);
		}
	}
});
