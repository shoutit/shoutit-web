import {RouteHandler} from 'react-router';
import React from 'react';
import Header from './header/header.jsx';
import Footer from './footer/footer.jsx';

export default React.createClass({
	displayName: "App",

	getInitialState() {
		return {
			height: null
		};
	},

	render() {
		return (
			<div>
				<Header ref="header" flux={this.props.flux}/>
				<RouteHandler {...this.props}/>
				<Footer ref="footer"/>
			</div>
		);
	}
});
