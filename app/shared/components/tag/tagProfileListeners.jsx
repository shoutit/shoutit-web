var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap').Col,
	findIndex = require('lodash/array/findIndex'),
	Loader = require('../helper/loader.jsx');


var Clear = require('../helper/clear.jsx'),
	ListenerRow = require('../profile/listenerRow.jsx');

module.exports = React.createClass({
	displayName: "ProfileListeners",

	statics: {
		fetchData: function (client, session, params) {
			return client.tags().getListeners(session, params.tagName);
		}
	},

	componentDidMount: function () {
		var tagName = this.props.tagName;

		if (!this.props.tags[tagName] || !this.props.tags[tagName].listeners) {
			this.props.flux.actions.loadTagListeners(tagName);
		}
	},

	render: function () {
		var tagName = this.props.tagName,
			loggedUser = this.props.user,
			tag = this.props.tags[tagName],
			listening = [],
			listeners = tag.listeners,
			flux = this.props.flux,
			listenerChildren, stat;

		if (listeners) {
			stat = <span>({listeners.length})</span>;
			listenerChildren = listeners.length ? listeners.map(function (listener, i) {
				var isListening = findIndex(listening, 'username', listener.username) > -1;
				return <ListenerRow key={"tag-listener-" + tagName + '-' + i } user={listener}
									listening={isListening} loggedUser={loggedUser} flux={flux}/>
			}) : <h4>This tag has no listeners</h4>;
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