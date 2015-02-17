/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	Header = require('./header.jsx'),
	RouteHandler = Router.RouteHandler;

var App = React.createClass({

	render: function () {
		return (
			<div>
				<Header/>
				<RouteHandler/>
			</div>
		);
	}
});

module.exports = App;