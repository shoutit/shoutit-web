/** @jsx React.DOM */

var React = require('react'),
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Section = require('./content/section.jsx');

module.exports = Content = React.createClass({
	render: function () {
		return (
			<div className="content">
				<Container className="padding0">
					<Col xs={12} md={8}>
						<Section/>
					</Col>
				</Container>
			</div>
		)
	}
});