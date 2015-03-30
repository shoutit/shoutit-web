var React = require('react');

var Clear = require('../../helper/clear.jsx'),
	EditInfoRow = require('./editInfoRow.jsx');


module.exports = React.createClass({
	displayName: "BasicInformation",

	render: function () {
		var user = this.props.user;

		return (
			<div className="pro-basic">
				<h3>Basic Information</h3>
				<Clear/>
				<EditInfoRow title="User Name" value={user.username}
					onSaveClicked={this.onSaveClicked("username")} onChange={this.onInfoChange("username")}/>
			</div>
		);
	},

	onSaveClicked: function(field) {
		var action = this.props.onSaveClicked;
		return function(newValue) {
			action(field,newValue);
		}
	},

	onInfoChange: function(field) {
		var action = this.props.onInfoChange;
		return function(newValue) {
			action(field, newValue)
		}
	}
});