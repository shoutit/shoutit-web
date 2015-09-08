import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';

export default React.createClass({
	displayName: "AccountInfo",
///////////////////////// my fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
	render() {
		let user = this.props.user;

		return (
			<div className="pro-basic">
				<h3>Account Information</h3>
				<Clear/>
				<EditInfoRow title="Change Password" type="password"
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
