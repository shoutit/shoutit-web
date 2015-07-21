import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import TopBar from './topBar.jsx';
import MainMenu from './mainMenu.jsx';
import DownloadPopup from '../misc/downloadPopup.jsx';

export default React.createClass({
	displayName: "Header",
	mixins: [new FluxMixin(React), new StoreWatchMixin("users", "locations")],

	getStateFromFlux() {
		let flux = this.getFlux();
		return {
			users: flux.store("users").getState(),
			locations: flux.store("locations").getState()
		};
	},

	render() {
		return (
			<header>
				<TopBar {...this.state.users} flux={this.getFlux()} onLogoutClicked={this.onLogoutClicked}/>
				<MainMenu current={this.state.locations.current} />
				{this.renderPopup()}
			</header>
		);
	},

	renderPopup() {
		return this.state.users.showDownloadPopup ?
			<DownloadPopup flux={this.getFlux()}/> : null;
	},

	onLogoutClicked() {
		this.getFlux().actions.logout();
	}
});
