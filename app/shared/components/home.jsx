/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	RouteHandler = Router.RouteHandler,
	DocumentTitle = require('react-document-title');

var Login = require('./login.jsx'),
	Header = require('./header.jsx'),
	Content = require('./content.jsx');


module.exports = React.createClass({
	displayName: "Home",
	title: "Home - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<Content/>
			</DocumentTitle>
		);
	}
});