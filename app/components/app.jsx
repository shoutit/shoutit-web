/** @jsx React.DOM */

var React = require('react'),
	Header = require('./header.jsx'),
	Content = require('./content.jsx');

module.exports = App = React.createClass({
	render: function () {
		return (
			<div>
				<Header/>
				<Content/>
			</div>
		);
	}
});