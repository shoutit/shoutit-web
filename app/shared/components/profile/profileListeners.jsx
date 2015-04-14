var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	DropdownButton = require('react-bootstrap/DropdownButton'),
	MenuItem = require('react-bootstrap/MenuItem'),
	findIndex = require('lodash/array/findIndex');

var Clear = require('../helper/clear.jsx'),
	ListenerRow = require('./listenerRow.jsx');

module.exports = React.createClass({
	displayName: "ProfileListeners",

	statics: {
		fetchData: function (client, session, params) {
			return client.users().getListeners(session, params.username);
		}
	},

	componentDidMount: function () {
		var username = this.props.username;

		if (!this.props.listeners[username]) {
			this.props.flux.actions.loadUserListeners(username);
		}
	},

	render: function () {
		var username = this.props.username,
			loggedUser = this.props.user,
			listening = this.props.listening[loggedUser] || [],
			listeners = this.props.listeners[username],
			flux = this.props.flux,
			listenerChildren, stat;

		if (listeners) {
			stat = <span>({listeners.length})</span>;
			listenerChildren = listeners.length ? listeners.map(function (listener, i) {
				var isListening = findIndex(listening, 'username', listener.username) > -1;
				return <ListenerRow key={"listener-" + username + '-' + i } user={listener}
									listening={isListening} loggedUser={loggedUser} flux={flux}/>
			}) : <h4>You don't have any listeners</h4>;
		} else {
			var Loader = require('halogen').PulseLoader;
			listenerChildren = <Loader color="#bfdd6d"/>;
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