/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	Input = require('react-bootstrap/Input'),
	Icon = require('../helper/icon.jsx'),
	LocSelect = require('./locSelect.jsx');

module.exports = HederLogo = React.createClass({
	render: function () {
		var searchAddon = (
			<button type="submit">
				<Icon name="search-icon"/>
			</button>
		);

		return (
			<Col className="header-logo" xs={12} md={7}>
				<Col className="logo" xs={3} md={3}>
					<Link to="app">
						<img src="img/logo.png"/>
					</Link>
				</Col>
				<Col className="header-search" xs={9} md={9}>
					<LocSelect/>
					<div id="imaginary_container">
						<Input
							type="text"
							addonAfter={searchAddon}
						/>
					</div>
				</Col>
			</Col>
		);
	}
});