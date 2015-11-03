import {RouteHandler, Navigation} from 'react-router';
import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import MainPage from './main/mainPage.jsx';


export default React.createClass({
	displayName: "App",
	mixins: [new FluxMixin(React), new StoreWatchMixin("users"), Navigation],

	getStateFromFlux() {
		let flux = this.getFlux();
		return {
			loggedIn: flux.store("users").getState().user,
		};
	},

	componentDidMount() {
		if(this.state.loggedIn) {
			this.replaceWith('/home/feed');
		}
	},

	render() {
		return <div><RouteHandler {...this.props}/></div>;
	}
});
