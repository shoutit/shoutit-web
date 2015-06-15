import React from 'react';
import {NavItemLink} from 'react-router-bootstrap';
import {Grid, Navbar, Nav} from 'react-bootstrap';

export default React.createClass({
	displayName: "MainMenu",

	render: function () {
		let currentCity = this.props.currentCity,
			linkParams = {};

		if (currentCity) {
			linkParams.city = encodeURIComponent(currentCity);
		}

		return (
			<div id="main-menu">
				<Grid>
					<Navbar toggleNavKey="mainMenu" bsStyle="link">
						<Nav eventKey="mainMenu">
							<NavItemLink to="feed" params={linkParams}>Home</NavItemLink>
							<NavItemLink to="offers" params={linkParams}>Offers</NavItemLink>
							<NavItemLink to="requests" params={linkParams}>Requests</NavItemLink>
						</Nav>
					</Navbar>
				</Grid>
			</div>
		);
	}
});
