import React from 'react';
import {Col} from 'react-bootstrap';
import findIndex from 'lodash/array/findIndex';
import {Loader, Clear} from '../helper';

import ListenerRow from './listenerRow.jsx';

export default React.createClass({
	displayName: "ProfileListeners",

	statics: {
		fetchData(client, session, params) {
			return client.users().getListeners(session, params.username);
		}
	},

	componentDidMount() {
		let username = this.props.username;

		if (!this.props.listeners[username]) {
			this.props.flux.actions.loadUserListeners(username);
		}
	},

	render() {
		let username = this.props.username,
			loggedUser = this.props.user,
			listening = this.props.listening[loggedUser] || [],
			listeners = this.props.listeners[username],
			flux = this.props.flux,
			listenerChildren, stat;

		if (listeners) {
			stat = <span>({listeners.length})</span>;
			listenerChildren = listeners.length ? listeners.map(function (listener, i) {
				let isListening = findIndex(listening, 'username', listener.username) > -1;
				return (
					<ListenerRow key={"listener-" + username + '-' + i } user={listener}
								 listening={isListening} loggedUser={loggedUser} flux={flux}/>
				);
			}) : <h4>You don't have any listeners</h4>;
		} else {
			listenerChildren = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:
							{stat}
						</p>
					</div>
					<Clear/>

					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
						{listenerChildren}
					</div>
				</div>
			</Col>
		);
	}
});
