/** @jsx React.DOM */

var React = require('react'),
	Login = require('./login.jsx'),
	Header = require('./header.jsx'),
	Content = require('./content.jsx'),
	DocumentTitle = require('react-document-title');


var Home = React.createClass({
	title: "Home - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<Content/>
			</DocumentTitle>
		);
	}
});

module.exports = Home;