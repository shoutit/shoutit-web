import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {MenuItemLink} from 'react-router-bootstrap';

import UserImage from '../user/userImage.jsx';


export default React.createClass({
	displayName: "ProfileDropdown",

	render() {
		let user = this.props.user;

		let title = (
			<UserImage name={user.name} image={user.image}/>);

		return (
			<DropdownButton ref="dropdown" title={title} noCaret={true} className="profile" navItem={true}
							alt={user.name}>
				<MenuItemLink to="user" params={{username: encodeURIComponent(user.username)}}>
					Profile
				</MenuItemLink>
				<MenuItem onSelect={this.props.onLogoutClicked}>
					Logout
				</MenuItem>
			</DropdownButton>
		);
	}
});
