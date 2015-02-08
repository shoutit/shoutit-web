/** @jsx React.DOM */

var React = require('react'),
	Col = require('react-bootstrap/Col');

module.exports = SectionHeader = React.createClass({
	getDefaultProps: function () {
		return {
			logoRight: false,
			logoSrc: "img/logoLG.png",
			agoText: "1 day ago"
		}
	},

	render: function () {
		return (
			<Col xs={12} md={2} mdPush={this.props.logoRight ? 10 : 0}>
				<img className="img-lg" src={this.props.logoSrc}/>
				<p className="show-day">{this.props.agoText}</p>
			</Col>
		);
	}
});