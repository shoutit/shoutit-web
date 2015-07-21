import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';


export default React.createClass({
	displayName: "ContactInformations",

	render() {
		let user = this.props.user;

		return (
			<div className="pro-basic">
				<h3>Contact Information</h3>
				<Clear/>
				<EditInfoRow title="Email" value={user.email}
							 onSaveClicked={this.onSaveClicked("email")} onChange={this.onInfoChange("email")}/>
				<EditInfoRow title="Adress" value={user.location.address}
							 onSaveClicked={this.onSaveClicked("address")} onChange={this.onInfoChange("address")}/>
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
