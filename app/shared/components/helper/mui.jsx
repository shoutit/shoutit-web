import React from 'react';
import Icon from './icon.jsx';

export default React.createClass({
	displayName: "Mui",

	getDefaultProps() {
		return {
			right: false
		};
	},

	render() {
		return (
			<Icon className={this.props.right ? "mui1" : "mui"} name={this.props.right ? "mui1" : "mui"}/>
		);
	}
});