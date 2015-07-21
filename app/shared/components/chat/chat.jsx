import React from 'react';
import {RouteHandler} from 'react-router';

import {Col} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';

import ConversationList from './conversations/list.jsx';

export default function (envData) {
	return React.createClass({
		displayName: "Chat",

		statics: {
			fetchData(client, session) {
				return client.conversations().load(session);
			},

			willTransitionTo(transition) {
				if(envData && !envData.user) {
					transition.redirect("login");
				}
			}
		},

		render() {
			return (
				<DocumentTitle title={"Shoutit - Chat"}>
					<div className="chat">
						<Col xs={12} md={4} className="chat-left-padding">
							<ConversationList {...this.props}/>
						</Col>
						<Col xs={12} md={8} className="chat-left-padding">
							<RouteHandler {...this.props}/>
						</Col>
					</div>
				</DocumentTitle>
			);
		}

	});
}
