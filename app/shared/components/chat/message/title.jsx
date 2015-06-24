import React from 'react';

export default React.createClass({
	displayName: "MessageListTitle",

	render() {
		return (
			<div className="chat-right-title">
				<p className="chat-name">{this.props.name}</p>
			</div>
		);
	}
});
