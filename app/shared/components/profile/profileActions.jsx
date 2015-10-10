import React from 'react';
import statuses from '../../consts/statuses.js';
import NotificationSystem from 'react-notification-system';

var {USER_LISTENING_CLICKED, USER_BUTTON_LISTENED, USER_BUTTON_UNLISTENED} = statuses;

export default React.createClass({
    displayName: "profileActions",
    _notificationSystem: null,

    getInitialState() {
        return {
            isLoading: false
        }
    },

    displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUpdate() {
        let status = this.props.status;
        let username = this.props.user.name;

        // statuses from flux
        switch(status) {
        case USER_BUTTON_LISTENED:
            this.displayNotif(`You are listening to ${username}`);
            this.setState({isLoading: false});
            break;
        case USER_BUTTON_UNLISTENED:
            this.displayNotif(`You are no longer listening to ${username}`);
            this.setState({isLoading: false});
            break;
        case USER_LISTENING_CLICKED:
            this.setState({isLoading: true});
            break;
        }
    },

    render() {
        let user = this.props.user,
            status = this.props.status,
            isLoading = this.state.isLoading,
            btn;
            
        // no need to load Listening button if user is not logged in or is the owner
        if (this.props.isUserLogged && !user.is_owner) {
            let isListening = user.is_listening;

            let title = isListening? "Listening": "Listen";
            let style = isListening? "shoutit-btn listen": "shoutit-btn not-listen";

            if(isLoading) {
                title = "Loading";
                style = "shoutit-btn loading";
            }

            // The main button of this compnent
            btn = <span className={style} onClick={this.toggleListen}>{title}</span>;
        }

        return (
            <div className="profile-details">
                <div className="birth">
                    {btn}
                </div>
                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    },

    toggleListen() {
        let user = this.props.user;

        if (user.is_listening) {
            this.props.flux.actions.stopListen(user.username);
        } else {
            this.props.flux.actions.listen(user.username);
        }
    }
});
