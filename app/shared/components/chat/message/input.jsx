import React from 'react';

export default React.createClass({
	displayName: "MessageListInput",

	render() {
		return (
			<div className="input-chat">
				<input type="text" onChange={this.props.onTextChange} value={this.props.text}/>

				<div className="input-text-bottom">
					<p className="reply" onClick={this.props.onReplyClicked}>Reply All</p>
				</div>
			</div>
		);
	}
});
