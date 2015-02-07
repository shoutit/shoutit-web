/** @jsx React.DOM */

var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Input = require('react-bootstrap/Input');

module.exports = HederLogo = React.createClass({
	render: function () {
		var searchAddon = (
			<button type="submit">
				<img src="img/search-icon.png"/>
			</button>
		);

		return (
			<Col className="header-logo" xs={12} md={7}>
				<Col className="logo" xs={3} md={3}>
					<a href="index.html">
						<img src="img/logo.png"/>
					</a>
				</Col>
				<Col className="header-search" xs={9} md={9}>
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