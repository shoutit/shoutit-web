import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';

export default React.createClass({
	displayName: "BasicInformation",

	render() {
		let user = this.props.user;
		let settings = {};

		if (this.props.status.username) {
			settings.loading = this.props.status.username.loading;
			settings.msg = this.props.status.username.msg;
		}

		return (
			<div className="pro-basic">
				<h3>Basic Information</h3>
				<Clear/>
				<EditInfoRow settings={settings} title="User Name" value={user.username}
							 onSaveClicked={this.onSaveClicked("username")} onChange={this.onInfoChange("username")}/>
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
