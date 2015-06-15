var React = require('react'),
	DropdownButton = require('react-bootstrap').DropdownButton,
	MenuItem = require('react-bootstrap').MenuItem,
	MenuItemLink = require('react-router-bootstrap').MenuItemLink;

var UserImage = require('../user/userImage.jsx');


module.exports = React.createClass({
	displayName: "ProfileDropdown",

	render: function () {
		var user = this.props.user;

		var title = (
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