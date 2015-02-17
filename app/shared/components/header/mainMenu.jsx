/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	NavItemLink = require('react-router-bootstrap').NavItemLink,
	Col = require('react-bootstrap/Col'),
	Container = require('react-bootstrap/Grid'),
	Navbar = require('react-bootstrap/Navbar'),
	Nav = require('react-bootstrap/Nav');

module.exports = MainMenu = React.createClass({
	render: function () {
		return (
			<div id="main-menu">
				<Container>
					<Navbar fluid={true} toggleNavKey="mainMenu" bsStyle="link">
						<Nav eventKey="mainMenu">
							<NavItemLink to="app">Home</NavItemLink>
							<NavItemLink to="offers">Offers</NavItemLink>
						</Nav>
					</Navbar>
				</Container>
			</div>
		);
	}
});