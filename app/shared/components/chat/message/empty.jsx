import React from 'react';

import {Col} from 'react-bootstrap';

import MessageListTitle from './title.jsx';

export default React.createClass({
	displayName: "EmptyMessageList",


	render() {
		return (
			<Col xs={12} md={12} className="chat-right">
				<MessageListTitle name={""}/>
				<h4>Select a conversation from the left.</h4>
			</Col>
		);
	}

});
