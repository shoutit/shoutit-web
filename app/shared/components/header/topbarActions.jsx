var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Nav = require('react-bootstrap/Nav');

var ProfileDropdown = require('./profileDropdown.jsx'),
	ShoutModalTrigger = require('./topBar/shoutModal.jsx'),
	MessageDropdown = require('./topbar/messageDropdown.jsx'),
	NotificationDropdown = require('./topbar/notificationDropdown.jsx');


module.exports = React.createClass({
	displayName: "TopBarActions",


	render: function () {
		var user = this.props.user;

		return (
			<Nav right={true}>
				<ShoutModalTrigger />
				<MessageDropdown />
				<NotificationDropdown />
				<ProfileDropdown user={user} onLogoutClicked={this.props.onLogoutClicked}/>
			</Nav>
		);
	}

});