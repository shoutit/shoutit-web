import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';
import ListenerRow from './listenerRow.jsx';


export default React.createClass({
	displayName: "ProfileListening",

	statics: {
		fetchData(client, session, params) {
			return client.users().getListening(session, params.username);
		}
	},

	componentDidMount() {
		let username = this.props.username;

		if (!this.props.listening[username] || !this.props.listening[username].users) {
			this.props.flux.actions.loadUserListening(username);
		}
	},

	render() {
		let username = this.props.username,
			loggedUser = this.props.user,
			listening = this.props.listening[username] ? this.props.listening[username].users : null,
			flux = this.props.flux,
			listeningChildren, stat;

		if (listening) {
			stat = <span>({listening.length})</span>;
			listeningChildren = listening.length ? listening.map(function (listener, i) {
				return (
					<ListenerRow key={"listening-" + username + '-' + i} user={listener}
								 listening={true} loggedUser={loggedUser} flux={flux}/>
				);
			}) : <h4>You aren't listening to any other user.</h4>;
		} else {
			listeningChildren = <Loader/>;
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
						{listeningChildren}
					</div>
				</div>
			</Col>
		);
	}
});
