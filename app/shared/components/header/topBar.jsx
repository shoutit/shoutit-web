import React from 'react';
import {Navigation} from 'react-router';
import {ButtonLink} from 'react-router-bootstrap';
import {Grid, Col, Row, Button, Popover, OverlayTrigger} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';

export default React.createClass({
	displayName: "TopBar",
	mixins: [Navigation],

	render() {
		let loggedUser = this.props.user ? this.props.users[this.props.user] : null;

		let xsSizes = {
			logo: 2,
			searchBar: loggedUser ? 8 : 7,
			actions: loggedUser ? 2 : 3
		};

		let loginAlert = 
				<Popover title="New to Shoutit?">
					To create a <strong>Shout</strong>, you first need to log in.
					Please&nbsp;
						<span style={{cursor:'pointer', color:'#99ca3b'}} onClick={() => this.transitionTo('login')}>
							click here
						</span>.
				</Popover>;

		return (
			<Row className="topBar">
				<Grid>
					<Col className="logo" xs={2} md={1}>
						<Logo/>
					</Col>
					<Col xs={xsSizes.searchBar} md={6}>
						<SearchBar/>
					</Col>
					<Col xs={xsSizes.actions} md={5}>
						{this.props.user ?
							<TopBarActions flux={this.props.flux} user={loggedUser}
										   onLogoutClicked={this.props.onLogoutClicked}/> :
							<div >
								<ButtonLink className="pull-right" to="login" id="loginButton">
									<span>Log In</span>
								</ButtonLink>
								<OverlayTrigger trigger="click" placement="bottom" overlay={loginAlert}>
									<Button className="shout-btn pull-right" style={{marginRight:'10px'}}>
										+ Create Shout
									</Button>
								</OverlayTrigger>
							</div>
						}
					</Col>
				</Grid>
			</Row>
		);
	}
});
