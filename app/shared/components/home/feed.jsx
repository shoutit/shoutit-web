/** @jsx React.DOM */

var React = require('react'),
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Shout = require('./feed/shout.jsx');

module.exports = React.createClass({
	displayName: "Feed",

	render: function () {
		return (
			<Col xs={12} md={8}>
				<Shout/>
			</Col>
		)
	}
});