import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';

export default React.createClass({
	displayName: "BasicInformation",

	render() {
		let user = this.props.user;

		return (
			<div className="pro-basic">
				<h3>Basic Information</h3>
				<Clear/>
				<EditInfoRow title="User Name" value={user.username}
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
