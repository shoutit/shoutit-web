var React = require('react'),
	ButtonLink = require('react-router-bootstrap').ButtonLink,
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Row = require('react-bootstrap/Row'),
	HeaderLogo = require('./headerLogo.jsx'),
	TopBarActions = require('./topbarActions.jsx');

module.exports = React.createClass({
	displayName:"TopBar",



	render: function () {

		var loggedUser = this.props.user ? this.props.users[this.props.user] : null;

		return (
			<Row id="row-logo">
				<Container>
					<HeaderLogo/>
					<Col className="header-icon" xs={12} md={4}>
					{this.props.user ?
						<TopBarActions user={loggedUser} onLogoutClicked={this.props.onLogoutClicked}/> :
						<ButtonLink to="login" id="loginButton">
							<span>Login</span>
						</ButtonLink>
						}
					</Col>
				</Container>
			</Row>
		);
	}
});