import React from 'react';
import {History} from 'react-router';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column} from '../helper';
import MainMenu from './mainMenu.jsx';
import {Icon} from '../helper';

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
			<div className="si-header">
				<Grid>
				<Column size="2" clear={true}>
					<Logo/>
				</Column>
				<Column size="6">
					<SearchBar height="36" flux={this.props.flux}/>
				</Column>
				<Column size="7" className="topbar-buttons">
					<MainMenu current={this.state.locations.current} />
					<Icon name="home"/>
					<Icon name="chat"/>
					<Icon name="notification"/>

					<Icon name="create-shout" className="topbar-create"/>
					{loggedUser?
						<TopBarActions flux={this.props.flux} user={loggedUser}
									   onLogoutClicked={this.props.onLogoutClicked}/> :
						<div>
							Not logged in placeholder
						</div>
					}

				</Column>
				</Grid>
			</div>
		);
	}
});
