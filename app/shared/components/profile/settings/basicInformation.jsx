import React from 'react';
import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';

export default React.createClass({
	displayName: "BasicInformation",
	getInitialState() {
		return {
			lastUser: null
		}
	},

	componentDidUpdate() {
		let user = this.props.user;
		if(user.username !== this.state.lastUser && this.state.lastUser !== null) {
			this.userChanged(user.username);
		}

	},

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

	onSaveClicked(field) {
		let action = this.props.onSaveClicked;

		return function (newValue) {
			// storing username so we will know if it changed
			this.setState({lastUser: this.props.user.username});
			action(field, newValue);
		}.bind(this);
	},

	userChanged(newUser) {
		if(this.props.onUserChanged) {
			this.props.onUserChanged(newUser);
		}
	},

	onInfoChange(field) {
		let action = this.props.onInfoChange;
		return function (newValue) {
			action(field, newValue);
		};
	}
});
