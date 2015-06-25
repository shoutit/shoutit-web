import React from 'react';
import {RouteHandler} from 'react-router';

import {Col} from 'react-bootstrap';

import ConversationList from './conversations/list.jsx';

export default React.createClass({
	displayName: "Chat",

	statics: {
		fetchData(client, session, params) {
			return client.conversations().load(session);
		}
	},

	render() {
		return (
			<div className="chat">
				<Col xs={12} md={4} className="chat-left-padding">
					<ConversationList {...this.props}/>
				</Col>
				<Col xs={12} md={8} className="chat-left-padding">
					<RouteHandler {...this.props}/>
				</Col>
			</div>
		);
	}

});
