import React from 'react';
import ChatNotificationBox from './chatNotificationBox.jsx';
import {Icon} from '../../helper';

export default React.createClass({
    displayName: "ChatTopbarButton",

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
                <Icon name="chat"/>
                {this.state.buttonIsActive? 
                    <ChatNotificationBox />:
                    null
                }
            </div>
        );
    }
});