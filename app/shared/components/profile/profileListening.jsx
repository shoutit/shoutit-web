var React = require('react'),
	Col = require('react-bootstrap/Col');

module.exports = React.createClass({
	displayName: "ProfileListening",

	statics: {
		fetchData: function(client, session) {
			return client.users().getListening(session);
		}
	},

	getDefaultProps: function () {
		return {
			listening: []
		};
	},

	onComponentDidMount: function () {
		if (this.props.listening.length === 0) {
			this.props.flux.actions.fetchListeners();
		}
	},

	render: function () {
		var listening = this.props.listening.length > 0 ?
			this.props.listening.map(function (listener) {
				return <ListenerRow user={listener} listening={true}/>
			}) : <Spinner/>;

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:
							<span>({this.props.listening.length})</span>
						</p>
					</div>
					<Clear/>
					<div class="listener-scroll" tabindex="5000" style="overflow: hidden; outline: none;">
					{listening}
					</div>
				</div>
			</Col>
		);
	}
});