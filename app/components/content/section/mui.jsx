/** @jsx React.DOM */

var React = require('react');

module.exports = Mui = React.createClass({
	getDefaultProps: function() {
		return {
			right: false
		};
	},

	render: function() {
		return (
			<img className={this.props.right ? "mui1" : "mui"} src={this.props.right ? "img/mui1.png" : "img/mui.png"}/>
		);
	}
});