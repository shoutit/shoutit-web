var React = require('react'),
	Router = require('react-router'),
	NavItemLink = require('react-router-bootstrap').NavItemLink,
	Container = require('react-bootstrap/Grid'),
	Navbar = require('react-bootstrap/Navbar'),
	Nav = require('react-bootstrap/Nav'),
	ButtonLink = require('react-router-bootstrap').ButtonLink;


module.exports = React.createClass({
	displayName: "MainMenu",

	render: function () {
		var brand = this.props.user ? "" : (
			<ButtonLink to="login" id="loginButton">
				<span>Login</span>
			</ButtonLink>
		);

		return (
			<div id="main-menu">
				<Container>
					<Navbar brand={brand} fluid={true} toggleNavKey="mainMenu" bsStyle="link">
						<Nav eventKey="mainMenu">
							<NavItemLink to="app">Home</NavItemLink>
							<NavItemLink to="offers">Offers</NavItemLink>
							<NavItemLink to="requests">Requests</NavItemLink>
							<NavItemLink to="map">Map</NavItemLink>
						</Nav>
					</Navbar>
				</Container>
			</div>
		);
	}
});