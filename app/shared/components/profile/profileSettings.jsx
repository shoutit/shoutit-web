var React = require('react'),
	Col = require('react-bootstrap/Col');

module.exports = React.createClass({
	displayName: "ProfileSettings",

	render: function () {
		return (
			<Col xs={12} md={12} className="profile-right">
				Profile Settings
			</Col>
		);
	}
});