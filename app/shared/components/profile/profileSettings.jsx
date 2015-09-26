import React from 'react';
import {Navigation} from 'react-router';
import {Col} from 'react-bootstrap';

import BasicInfo from './settings/basicInformation.jsx';
import ContactInfos from './settings/contactInfos.jsx';
import AccountInfo from './settings/accountInfo.jsx';

export default React.createClass({
	displayName: "ProfileSettings",
	mixins: [Navigation],

	componentDidUpdate() {
		let username = this.props.user;
		let paramUsername = this.props.username;

		if(username !== paramUsername) {
			this.onUserChanged(username);
		}
	},

	render() {
		let username = this.props.username;
		let user = this.props.users[username];

		return (
			<Col xs={12} md={12} className="profile-right">
				<BasicInfo status={this.props.editors} user={user} onSaveClicked={this.onSaveClicked} 
							  onInfoChange={this.onInfoChange} />
				<ContactInfos status={this.props.editors} user={user} onSaveClicked={this.onSaveClicked}
							  onInfoChange={this.onInfoChange}
							  onVerifyClicked={this.handleVerify}/>
				<AccountInfo status={this.props.editors} user={user} onSaveClicked={this.onSaveClicked} 
							  onInfoChange={this.onInfoChange}/>
			</Col>
		);
	},

	onSaveClicked(field, newValue) {
		let flux = this.props.flux;

		field !== 'password'?
			flux.actions.saveInfo(field, newValue):
			flux.actions.changePass(newValue);
	},

	onUserChanged(newUser) {
		this.replaceWith('user', {username: newUser});
	},

	componentWillMount() {
		if (!this.props.user || !this.props.users[this.props.username].is_owner) {
			this.replaceWith("useroffers", {username: this.props.username});
		}
	},

	onInfoChange(field, newValue) {
		this.props.flux.actions.changeInfo(field, newValue);
	},

	handleVerify(field) {
		this.props.flux.actions.resendEmailVerif();
	}
});
