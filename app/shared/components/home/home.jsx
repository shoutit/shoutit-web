/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	RouteHandler = Router.RouteHandler,
	DocumentTitle = require('react-document-title');

var Feed = require('./feed.jsx');


module.exports = React.createClass({
	displayName: "Home",
	title: "Home - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<Feed/>
			</DocumentTitle>
		);
	}
});