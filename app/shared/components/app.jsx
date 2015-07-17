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
		//var style = {};
		//
		//if (this.state.height) {
		//    style.height = this.state.height + "px";
		//}

		return (
			<div>
				<Header ref="header" flux={this.props.flux}/>
				<RouteHandler {...this.props}/>
				<Footer ref="footer"/>
			</div>
		);
	},
	// <Footer ref="footer"/>
	//   componentDidMount() {
	//       if (window.innerWidth >= 991) {
	//           this.resize();
	//       }
	//
	//       window.onresize = function () {
	//           this.resize();
	//       }.bind(this);
	//   },
	//
	//   resize() {
	//       var newHeight = window.innerHeight -
	//           React.findDOMNode(this.refs.header).offsetHeight -
	//           React.findDOMNode(this.refs.footer).offsetHeight;
	//
	//       if (newHeight !== this.state.height) {
	//           this.setState({
	//               height: newHeight
	//           });
	//       }
	//   }
});
