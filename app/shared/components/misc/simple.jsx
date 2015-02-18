/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	DocumentTitle = require('react-document-title');

var NotFound = React.createClass({
	title: "Simple - Shout It",
	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<div>
					Dummy Page
				</div>
			</DocumentTitle>
		);
	}
});

module.exports = NotFound;