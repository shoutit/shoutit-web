import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import TopBar from './topBar.jsx';
import MainMenu from './mainMenu.jsx';
import DownloadPopup from '../misc/downloadPopup.jsx';

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
				{this.renderPopup()}
			</header>
		);
	},

	renderPopup() {
		return this.state.users.showDownloadPopup ?
			<DownloadPopup flux={this.props.flux}/> : null;
	},

	onLogoutClicked() {
		this.props.flux.actions.logout();
	}
});
