import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';

export default React.createClass({
	displayName: "AccountInfo",

	render() {
		let user = this.props.user;
		let settings = {};

		settings.has_old_password = user['is_password_set'];
		if (this.props.status.hasOwnProperty("password")) {
			settings.loading = this.props.status.password.loading;
			settings.msg = this.props.status.password.msg;
		}
		
		return (
			<div className="pro-basic">
				<h3>Account Information</h3>
				<Clear/>
				<EditInfoRow settings={settings} title="Change Password" type="password"
							 onSaveClicked={this.onSaveClicked("password")} onChange={this.onInfoChange("password")}/>
			</div>
		);
	},

	onSaveClicked: function (field) {
		let action = this.props.onSaveClicked;
		return function (newValue) {
			action(field, newValue);
		};
	},

	onInfoChange: function (field) {
		let action = this.props.onInfoChange;
		return function (newValue) {
			action(field, newValue);
		};
	}
});
