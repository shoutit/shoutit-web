import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Grid, Navbar, Nav, NavItem} from 'react-bootstrap';

export default React.createClass({
	displayName: "MainMenu",

	render() {
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
							<LinkContainer to={`/all/${linkParams}`}><NavItem>Home</NavItem></LinkContainer>
							<LinkContainer to={`/offers/${linkParams}`}><NavItem>Offers</NavItem></LinkContainer>
							<LinkContainer to={`/requests/${linkParams}`}><NavItem>Requests</NavItem></LinkContainer>
							<LinkContainer to={`/discover/${linkParams}`}><NavItem>Discover</NavItem></LinkContainer>
							<LinkContainer to={`/chat`}><NavItem>Chat</NavItem></LinkContainer>
						</Nav>
					</Navbar>
				</Grid>
			</div>
		);
	}
});
