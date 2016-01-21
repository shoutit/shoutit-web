import React from 'react';
import {History} from 'react-router';
import {Button} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import ProfileDropdown from './profileDropdown.jsx';
import Logo from './logo.jsx';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column} from '../helper';
import {Icon} from '../helper';
import ChatTopbarButton from './notifications/chatTopbarButton.jsx';
import NotifTopbarButton from './notifications/notifTopbarButton.jsx';
import NewShoutButton from '../shouting/newShoutButton.jsx';

export default React.createClass({
	displayName: "Header",
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
		const users = this.state.users;
		const flux = this.props.flux;
		const loggedUser = users.user? users.users[users.user] : null;
		const country = encodeURIComponent(this.state.locations.current);

		return (
			<header>
				<Grid className="si-header">
					<Column size="2" className="header-logo" clear={true}>
						<Logo/>
					</Column>
					<Column className="header-search" size="6">
						<SearchBar height="36" flux={flux}/>
					</Column>
					<Column size="7" className="topbar-buttons">
						<div className="topbar-links">
							<Link to={`/home`}>Browse</Link>
							<Link to={`/discover/${country}`}>Discover</Link>
						</div>

                        {/* Notification Icons */}
						<Icon name="home"/>
						<ChatTopbarButton flux={flux} user={loggedUser} />
						<NotifTopbarButton flux={flux} user={loggedUser} />

						<NewShoutButton flux={flux}/>

						{loggedUser?
                            <ProfileDropdown user={user}/>
                            :
							<div style={{fontSize: '12px'}}>
								Not logged in
							</div>
						}
					</Column>
				</Grid>
			</header>
		);
	}
});