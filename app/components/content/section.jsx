/** @jsx React.DOM */

var React = require('react'),
	Col = require('react-bootstrap/Col'),
	SectionHeader = require('./section/header.jsx'),
	SectionBody = require('./section/body.jsx');

module.exports = Section = React.createClass({
	render: function() {
		return (
			<section>
				<Col xs={12} md={12}>
					<SectionHeader agoText="1 day ago" logoRight={true} logoSrc="img/logoSN.png"/>
					<SectionBody logoRight={true}/>
				</Col>
			</section>
		);
	}
});