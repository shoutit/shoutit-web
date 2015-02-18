/** @jsx React.DOM */

var React = require('react'),
	Icon = require('../../../helper/icon.jsx');

module.exports = Mui = React.createClass({
	getDefaultProps: function() {
		return {
			right: false
		};
	},

	render: function() {
		return (
			<Icon className={this.props.right ? "mui1" : "mui"} name={this.props.right ? "mui1" : "mui"}/>
		);
	}
});