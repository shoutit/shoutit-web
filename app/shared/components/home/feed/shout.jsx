/** @jsx React.DOM */

var React = require('react'),
	Col = require('react-bootstrap/Col'),
	ShoutHeader = require('./shout/header.jsx'),
	ShoutBody = require('./shout/body.jsx');

module.exports = React.createClass({
	displayName: "Shout",

	render: function() {
		return (
			<section>
				<Col xs={12} md={12}>
					<ShoutHeader agoText="1 day ago" logoRight={false} logoSrc="img/dummies/logoSN.png"/>
					<ShoutBody logoRight={false}/>
				</Col>
			</section>
		);
	}
});