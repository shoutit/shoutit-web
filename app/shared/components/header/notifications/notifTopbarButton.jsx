import React from 'react';
import NotificationBox from './notificationBox.jsx';
import {Icon} from '../../helper';

export default React.createClass({
    displayName: "NotifTopbarButton",

    getInitialState() {
        return {
            buttonIsActive: false
        }
    },

    onMouseHover() {
        this.setState({buttonIsActive: true});
    },

    onMouseExit() {
        this.setState({buttonIsActive: false});
    },

    render() {
        return (
            <div onMouseEnter={this.onMouseHover} onMouseLeave={this.onMouseExit} className="topbar-buttons-notif">
                <Icon name="notification"/>
                {this.state.buttonIsActive? 
                    <NotificationBox />:
                    null
                }
            </div>
        );
    }
});