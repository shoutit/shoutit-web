import React from 'react';
import {History} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Grid, Col, Row, Button, Popover, OverlayTrigger} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';
import isMobile from 'ismobilejs';

let mobile = isMobile.any;

export default React.createClass({
	displayName: "TopBar",
	mixins: [History],

	render() {
		let loggedUser = this.props.user ? this.props.users[this.props.user] : null;

		let xsSizes = {
			logo: 2,
			searchBar: loggedUser ? 7 : 6,
			actions: loggedUser ? 3 : 4
		};

		let loginAlert = 
				<Popover title="New to Shoutit?">
					To create a <strong>Shout</strong>, you first need to log in.
					Please&nbsp;
						<span style={{cursor:'pointer', color:'#99ca3b'}} onClick={() => this.history.pushState(null, '/login')}>
							click here
						</span>.
				</Popover>;
        let searchBarColClassName = '';
        let actionsColClassName = '';
        if (mobile) {
            if (loggedUser) {
                searchBarColClassName = 'searchBarCol62';
            } else {
                searchBarColClassName = 'searchBarCol51';
                actionsColClassName = 'actionsCol42';
            }
        }
		return (
			<Row className="topBar">
				<Grid>
					<Col className="logo" xs={2} md={1}>
						<Logo/>
					</Col>
					<Col className={searchBarColClassName} xs={xsSizes.searchBar} md={6}>
						<SearchBar/>
					</Col>
					<Col className={actionsColClassName} xs={xsSizes.actions} md={5}>
						{this.props.user ?
							<TopBarActions flux={this.props.flux} user={loggedUser}
										   onLogoutClicked={this.props.onLogoutClicked}/> :
							<div>
								<LinkContainer to="login" id="loginButton">
									<Button className="pull-right">Log In</Button>
								</LinkContainer>
								<OverlayTrigger trigger="click" placement="bottom" overlay={loginAlert}>
									<Button className="shout-btn pull-right" style={{marginRight:'5px'}}>
										{mobile ? '+' : '+ Create Shout'}
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
