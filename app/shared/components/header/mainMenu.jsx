import React from 'react';
import {NavItemLink} from 'react-router-bootstrap';
import {Grid, Navbar, Nav} from 'react-bootstrap';

export default React.createClass({
	displayName: "MainMenu",

	render: function () {
		return (
			<div id="main-menu">
				<Grid>
					<Navbar toggleNavKey="mainMenu" bsStyle="link">
						<Nav eventKey="mainMenu">
							<NavItemLink to="app">Home</NavItemLink>
							<NavItemLink to="offers">Offers</NavItemLink>
							<NavItemLink to="requests">Requests</NavItemLink>
						</Nav>
					</Navbar>
				</Grid>
			</div>
		);
	}
});
