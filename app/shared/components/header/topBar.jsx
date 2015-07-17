import React from 'react';
import {ButtonLink} from 'react-router-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';

export default React.createClass({
	displayName: "TopBar",

	render() {
		let loggedUser = this.props.user ? this.props.users[this.props.user] : null;

		let xsSizes = {
			logo: 2,
			searchBar: loggedUser ? 8 : 7,
			actions: loggedUser ? 2 : 3
		};

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
							<ButtonLink className="pull-right" to="login" id="loginButton">
								<span>Login</span>
							</ButtonLink>
						}
					</Col>
				</Grid>
			</Row>
		);
	}
});
