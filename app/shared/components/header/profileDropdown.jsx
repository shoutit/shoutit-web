import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import UserImage from '../user/userImage.jsx';

export default React.createClass({
	displayName: "ProfileDropdown",

	render() {
		let user = this.props.user;
		let username = encodeURIComponent(user.username);

		let title = (
			<UserImage name={user.name} image={user.image}/>);

		return (
			<DropdownButton ref="dropdown" title={title} noCaret={true} className="profile" navItem={true}
							alt={user.name}>
				<LinkContainer to={`/user/${username}`}>
					<MenuItem>
						Profile
					</MenuItem>
				</LinkContainer>
				<MenuItem onSelect={this.props.onLogoutClicked}>
					Logout
				</MenuItem>
			</DropdownButton>
		);
	}
});
