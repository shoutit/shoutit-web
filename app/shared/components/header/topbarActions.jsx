var React = require('react'),
    Nav = require('react-bootstrap').Nav;

var ProfileDropdown = require('./profileDropdown.jsx');
    //ShoutModalTrigger = require('./topbar/shoutModal.jsx'),
    //MessageDropdown = require('./topbar/messageDropdown.jsx'),
    //NotificationDropdown = require('./topbar/notificationDropdown.jsx');

/*
 <ShoutModalTrigger />
 <MessageDropdown />
 <NotificationDropdown />
 */


module.exports = React.createClass({
    displayName: "TopBarActions",

    render: function () {
        var user = this.props.user;

        return (
            <Nav right={true}>
                <ProfileDropdown user={user} onLogoutClicked={this.props.onLogoutClicked}/>
            </Nav>
        );
    }

});
