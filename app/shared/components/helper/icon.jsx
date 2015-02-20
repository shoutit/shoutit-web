/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	displayName: "Icon",
	render: function() {
		var className = "icons-" + this.props.name + " " + (this.props.className || "");
		return (
			<div className={className}/>
		)
	}
});