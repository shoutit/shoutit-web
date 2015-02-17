/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	Container = require('react-bootstrap/Grid'),
	Navbar = require('react-bootstrap/Navbar'),
	Nav = require('react-bootstrap/Nav'),
	DropdownButton = require('react-bootstrap/Dropdownbutton'),
	NavItem = require('react-bootstrap/NavItem');

module.exports = MainMenu = React.createClass({
	render: function () {
		return (
			<div id="main-menu">
				<Container>
					<Navbar fluid={true} toggleNavKey="mainMenu" bsStyle="link">
						<Nav eventKey="mainMenu">
							<DropdownButton title="Home" href="/">

							</DropdownButton>
							<NavItem href="/offers">Offers</NavItem>
							<NavItem href="#">Requests</NavItem>
							<NavItem href="#">Map</NavItem>
							<NavItem href="#">More</NavItem>
						</Nav>
					</Navbar>
				</Container>
			</div>
		);
	},
	onToggle: function () {
		console.log("Hello");
	}
});