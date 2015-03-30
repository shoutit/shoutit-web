var React = require('react'),
	Col = require('react-bootstrap/Col');

var BasicInfo = require('./settings/basicInformation.jsx');

module.exports = React.createClass({
	displayName: "ProfileSettings",

	render: function () {
		return (
			<Col xs={12} md={12} className="profile-right">
				<BasicInfo user={this.props.user} onSaveClicked={this.onSaveClicked} onInfoChange={this.onInfoChange}/>
			</Col>
		);
	},

	onSaveClicked: function(field, newValue) {
		this.props.flux.actions.saveInfo(field, newValue);

	},

	onInfoChange: function(field, newValue) {
		this.props.flux.actions.changeInfo(field, newValue);
	}
});