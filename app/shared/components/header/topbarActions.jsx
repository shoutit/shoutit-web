import React from 'react';
import {Nav} from 'react-bootstrap';
import ProfileDropdown from './profileDropdown.jsx';
import ShoutModalTrigger from './topbar/shoutModal.jsx';
//import MessageDropdown from './topbar/messageDropdown.jsx';
//import NotificationDropdown from './topbar/notificationDropdown.jsx';

/*
 <MessageDropdown />
 <NotificationDropdown />
 <ShoutModalTrigger flux={this.props.flux} />
 */


export default React.createClass({
	displayName: "TopBarActions",

	render() {
		let user = this.props.user;

		return (
			<Nav pullRight={true}>
				<ShoutModalTrigger flux={this.props.flux} />
				<ProfileDropdown user={user} onLogoutClicked={this.props.onLogoutClicked}/>
			</Nav>
		);
	}

	// <ShoutModalTrigger flux={this.props.flux} />

});
