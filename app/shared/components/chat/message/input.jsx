import React from 'react';

export default React.createClass({
	displayName: "MessageListInput",

	propTypes: {
		onTextChange: React.PropTypes.func,
		onReplyClicked: React.PropTypes.func,
		text: React.PropTypes.string
	},

	render() {
		return (
			<div className="input-chat">
				<input type="text"
					   onChange={this.props.onTextChange}
					   onKeyUp={this.onKeyUp}
					   value={this.props.text}/>

				<div className="input-text-bottom">
					<p className="reply" onClick={this.onSubmit}>Send</p>
				</div>
			</div>
		);
	},

	onSubmit() {
		if (this.props.text && this.props.text.length) {
			this.props.onReplyClicked();
		}
	},

	onKeyUp(ev) {
		if (ev.which === 13) {
			this.onSubmit();
		}
	}
});
