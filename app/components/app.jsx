/** @jsx React.DOM */

var React = require('react'),
	Header = require('./header.jsx');

module.exports = App = React.createClass({
	render: function() {
		return (
			<Header/>
		)
	}
});