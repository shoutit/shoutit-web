/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	Header = require('./header.jsx'),
	RouteHandler = Router.RouteHandler;

module.exports = App = React.createClass({
	render: function () {
		return (
			<div>
				<Header/>
				<RouteHandler/>
			</div>
		);
	}
});