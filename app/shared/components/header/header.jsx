import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import TopBar from './topBar.jsx';
import MainMenu from './mainMenu.jsx';

export default React.createClass({
	displayName: "Header",
	mixins: [new StoreWatchMixin("users", "locations")],

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
		return (
			<header>
				<TopBar {...this.state.users} flux={this.props.flux} onLogoutClicked={this.onLogoutClicked}/>
				<MainMenu current={this.state.locations.current} />
			</header>
		);
	},

	onLogoutClicked() {
		this.props.flux.actions.logout();
	}
});
