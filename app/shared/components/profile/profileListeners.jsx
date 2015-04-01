var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	DropdownButton = require('react-bootstrap/DropdownButton'),
	MenuItem = require('react-bootstrap/MenuItem'),
	Spinner = require('../misc/spinner.jsx'),
	_ = require('lodash');

var Clear = require('../helper/clear.jsx'),
	ListenerRow = require('./listenerRow.jsx');

module.exports = React.createClass({
	displayName: "ProfileListeners",

	statics: {
		fetchData: function(client, session) {
			return client.users().getListeners(session);
		}
	},

	getDefaultProps: function () {
		return {
			listeners: [],
			listening: []
		};
	},

	onComponentDidMount: function () {
		if (this.props.listeners.length === 0 || this.props.listening.length === 0) {
			this.props.flux.actions.fetchListeners();
			this.props.flux.actions.fetchListening();
		}
	},

	render: function () {
		var listening = this.props.listening;
		var listeners = this.props.listeners.length > 0 ?
			this.props.listeners.map(function (listener) {
				var isListening = _.findIndex(listening, 'username', listener.username);
				return <ListenerRow user={listener} listening={isListening}/>
			}) : <Spinner/>;

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:
							<span>({this.props.listeners.length})</span>
						</p>
					</div>
					<Clear/>
					<div class="listener-scroll" tabindex="5000" style="overflow: hidden; outline: none;">
					{listeners}
					</div>
				</div>
			</Col>
		);
	}
});