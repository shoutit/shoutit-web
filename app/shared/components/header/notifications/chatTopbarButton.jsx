import React from 'react';
import {Link} from 'react-router';
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
                <Link to="/chat"><Icon name="chat"/></Link>
                {this.state.buttonIsActive?
                    <ChatNotificationBox />:
                    null
                }
            </div>

        );
    }
});
