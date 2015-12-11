import React from 'react';
import {History} from 'react-router';
import {Button} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column} from '../helper';
import MainMenu from './mainMenu.jsx';
import {Icon} from '../helper';
import ChatTopbarButton from './notifications/chatTopbarButton.jsx';
import NotifTopbarButton from './notifications/notifTopbarButton.jsx';
import NewShoutButton from '../shouting/newShoutButton.jsx';

export default React.createClass({
	displayName: "TopBar",
	mixins: [new StoreWatchMixin("users", "locations"), History],

	getStateFromFlux() {
		let flux = this.props.flux;
		return {
			users: flux.store("users").getState(),
			locations: flux.store("locations").getState()
		};
	},

	componentDidMount() {
		this.props.flux.actions.acquireLocation();
	},

	render() {
		let users = this.state.users;
		let loggedUser = users.user? users.users[users.user] : null;

		return (
			<Grid className="si-header">
			<Column size="2" className="header-logo" clear={true}>
				<Logo/>
			</Column>
			<Column className="header-search" size="6">
				<SearchBar height="36" flux={this.props.flux}/>
			</Column>
			<Column size="7" className="topbar-buttons">
				<MainMenu current={this.state.locations.current} />
				<Icon name="home"/>
				<ChatTopbarButton flux={this.props.flux} user={loggedUser} />
				<NotifTopbarButton flux={this.props.flux} user={loggedUser} />

				
				<NewShoutButton flux={this.props.flux}/>
				{loggedUser?
					<TopBarActions flux={this.props.flux} user={loggedUser}
								   onLogoutClicked={this.props.onLogoutClicked}/> :
					<div style={{fontSize: '12px'}}>
						Not logged in
					</div>
				}

			</Column>
			</Grid>
		);
	}
});
