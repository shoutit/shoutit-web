import React from 'react';
import History from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import MainPage from './main/mainPage.jsx';


export default React.createClass({
	displayName: "App",
	mixins: [History, new StoreWatchMixin("users")],

	getStateFromFlux() {
		let flux = this.props.flux;
		return {
			loggedIn: flux.store("users").getState().user,
		};
	},

	componentDidMount() {
		if(this.state.loggedIn) {
			this.history.replaceState('/home/feed');
		}
	},

	render() {
		return <div>{this.props.children}</div>;
	}
});
