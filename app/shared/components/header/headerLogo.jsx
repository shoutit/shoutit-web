/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	Input = require('react-bootstrap/Input'),
	Logo = require('./logo.jsx'),
	Search = require('./search.jsx');

module.exports = HederLogo = React.createClass({
	render: function () {
		return (
			<Col className="header-logo" xs={12} md={7}>
				<Col className="logo center" xs={3} md={3}>
					<Logo />
				</Col>
				<Col className="header-search center" xs={9} md={9}>
					<Search/>
				</Col>
			</Col>
		);
	}
});