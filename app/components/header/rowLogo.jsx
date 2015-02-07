/** @jsx React.DOM */

var React = require('react'),
	Container = require('react-bootstrap/Grid'),
	HeaderLogo = require('./headerLogo.jsx'),
	HeaderIcon = require('./headerIcon.jsx');

module.exports = RowLogo = React.createClass({
	render: function () {
		return (
			<div id="row-logo">
				<Container>
					<HeaderLogo/>
					<HeaderIcon/>
				</Container>
			</div>
		);
	}
});