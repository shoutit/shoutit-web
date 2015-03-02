var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	ButtonLink = require('react-router-bootstrap').ButtonLink,
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Row = require('react-bootstrap/Row'),
	HeaderLogo = require('./headerLogo.jsx'),
	TopBarActions = require('./topbarActions.jsx');

module.exports = React.createClass({
	displayName:"TopBar",

	mixins: [FluxMixin, StoreWatchMixin("user")],

	getStateFromFlux: function () {
		var flux = this.getFlux();
		return flux.store("user").getState();
	},

	render: function () {
		return (
			<Row id="row-logo">
				<Container>
					<HeaderLogo/>
					<Col className="header-icon" xs={12} md={4}>
					{this.state.user ?
						<TopBarActions user={this.state.user} onLogoutClicked={this.onLogoutClicked}/> :
						<ButtonLink to="login" id="loginButton">
							<span>Login</span>
						</ButtonLink>
						}
					</Col>
				</Container>
			</Row>
		);
	},

	onLogoutClicked: function () {
		this.getFlux().actions.logout();
	}
});