var React = require('react'),
	Router = require('react-router'),
	Col = require('react-bootstrap/Col');

var BasicInfo = require('./settings/basicInformation.jsx'),
	ContactInfos = require('./settings/contactInfos.jsx');

module.exports = React.createClass({
	displayName: "ProfileSettings",
	mixins: [Router.Navigation],

	render: function () {
		var user = this.props.users[this.props.username];

		return (
			<Col xs={12} md={12} className="profile-right">
				<BasicInfo user={user} onSaveClicked={this.onSaveClicked} onInfoChange={this.onInfoChange}/>
				<ContactInfos user={user} onSaveClicked={this.onSaveClicked}
							  onInfoChange={this.onInfoChange}/>
			</Col>
		);
	},

	onSaveClicked: function (field, newValue) {
		this.props.flux.actions.saveInfo(field, newValue);

	},

	componentWillMount: function () {
		if (!this.props.user || !this.props.users[this.props.username].is_owner) {
			this.transitionTo("useroffers", {username: this.props.username});
		}
	},

	onInfoChange: function (field, newValue) {
		this.props.flux.actions.changeInfo(field, newValue);
	}
});