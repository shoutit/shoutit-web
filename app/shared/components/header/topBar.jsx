/** @jsx React.DOM */

var React = require('react'),
	Container = require('react-bootstrap/Grid'),
	Row = require('react-bootstrap/Row'),
	HeaderLogo = require('./headerLogo.jsx'),
	TopBarActions = require('./topbarActions.jsx');

module.exports = RowLogo = React.createClass({
	render: function () {
		return (
			<Row id="row-logo">
				<Container>
					<HeaderLogo/>
					<TopBarActions/>
				</Container>
			</Row>
		);
	}
});