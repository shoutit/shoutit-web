import React from 'react';
import {Nav} from 'react-bootstrap';
import ProfileDropdown from './profileDropdown.jsx';
//import ShoutModalTrigger from './topbar/shoutModal.jsx';
//import MessageDropdown from './topbar/messageDropdown.jsx';
//import NotificationDropdown from './topbar/notificationDropdown.jsx';

/*
 <MessageDropdown />
 <NotificationDropdown />
 <ShoutModalTrigger />
 */

export default React.createClass({
    displayName: "TopBarActions",

    render() {
        var user = this.props.user;

        return (
            <Nav right={true}>


                <ProfileDropdown user={user} onLogoutClicked={this.props.onLogoutClicked}/>
            </Nav>
        );
    }

});
