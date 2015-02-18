/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	RouteHandler = Router.RouteHandler;

module.exports =  React.createClass({
	displayName: "Root",

	render: function () {
		return (
			<RouteHandler/>
		);
	}
});
