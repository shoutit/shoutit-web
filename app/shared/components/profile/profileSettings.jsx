import React from 'react';
import {Navigation} from 'react-router';
import {Col} from 'react-bootstrap';

import BasicInfo from './settings/basicInformation.jsx';
import ContactInfos from './settings/contactInfos.jsx';

export default React.createClass({
	displayName: "ProfileSettings",
	mixins: [Navigation],

	render() {
		let user = this.props.users[this.props.username];

		return (
			<Col xs={12} md={12} className="profile-right">
				<BasicInfo user={user} onSaveClicked={this.onSaveClicked} onInfoChange={this.onInfoChange}/>
				<ContactInfos user={user} onSaveClicked={this.onSaveClicked}
							  onInfoChange={this.onInfoChange}/>
			</Col>
		);
	},

	onSaveClicked(field, newValue) {
		this.props.flux.actions.saveInfo(field, newValue);

	},

	componentWillMount() {
		if (!this.props.user || !this.props.users[this.props.username].is_owner) {
			this.transitionTo("useroffers", {username: this.props.username});
		}
	},

	onInfoChange(field, newValue) {
		this.props.flux.actions.changeInfo(field, newValue);
	}
});
