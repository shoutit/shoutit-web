/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	DocumentTitle = require('react-document-title');

var NotFound = React.createClass({
	title: "Not Found - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<div>
					Page not Found!
				</div>
			</DocumentTitle>
		);
	}
});

module.exports = NotFound;