import React from 'react';
import {NavItemLink} from 'react-router-bootstrap';
import {Grid, Navbar, Nav} from 'react-bootstrap';

export default React.createClass({
	displayName: "MainMenu",

	render: function () {
		let currentCity = this.props.current.city,
			currentCountry = this.props.current.country,
			currentState = this.props.current.state,
			linkParams = {};

		if (currentCity && currentCountry && currentState) {
			linkParams.city = encodeURIComponent(currentCity);
			linkParams.state = encodeURIComponent(currentState);
			linkParams.country = encodeURIComponent(currentCountry);
		}

		return (
			<div id="main-menu">
				<Grid>
					<Navbar bsStyle="link">
						<Nav eventKey="mainMenu" collapsable={false}>
							<NavItemLink to="feed" params={linkParams}>Home</NavItemLink>
							<NavItemLink to="offers" params={linkParams}>Offers</NavItemLink>
							<NavItemLink to="requests" params={linkParams}>Requests</NavItemLink>
							<NavItemLink to="discover" params={linkParams}>Discover</NavItemLink>
							<NavItemLink to="chat">Chat</NavItemLink>
						</Nav>
					</Navbar>
				</Grid>
			</div>
		);
	}
});
