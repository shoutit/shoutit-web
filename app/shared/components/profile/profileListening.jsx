var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Clear = require('../helper/clear.jsx');

module.exports = React.createClass({
	displayName: "ProfileListening",

	statics: {
		fetchData: function (client, session) {
			return client.users().getListening(session);
		}
	},

	componentDidMount: function () {
		if (this.props.listening.length) {
			this.props.flux.actions.fetchListening();
		}
	},

	render: function () {
		var listening;
		if (this.props.listening.length) {
			listening = this.props.listening.map(function (listener) {
				return <ListenerRow user={listener} listening={true}/>
			});
		} else if(this.props.loading && typeof window !== 'undefined') {
			var Loader = require('halogen').PulseLoader;
			listening = <Loader color="#bfdd6d"/>;
		} else {
			listening = <h4>You aren't listening to any other user.</h4>
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:
							<span>({this.props.listening.length})</span>
						</p>
					</div>
					<Clear/>
					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
					{listening}
					</div>
				</div>
			</Col>
		);
	}
});