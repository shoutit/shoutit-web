var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Logo = require('./logo.jsx'),
	Search = require('./search.jsx');

module.exports = React.createClass({
	displayName: "HeaderLogo",

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