import React from 'react';
import {Grid, Column, Icon} from '../../helper';
import NotificationSystem from 'react-notification-system';
import ListenButton from '../../general/listenButton.jsx';
import MessageButton from '../../general/messageButton.jsx';
import ListenersButton from '../../general/listenersButton.jsx';
import ListeningButton from '../../general/listeningButton.jsx';
import UserListeningTagsButton from '../../general/userListeningTagsButton.jsx';
import Popuplist from '../popuplist/popuplist.jsx';

export default React.createClass({
    displayName: "ProfileButtonsCard",
    _notificationSystem: null,

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    contextTypes: {
        flux: React.PropTypes.object
    },

    getInitialState() {
        return {
            activePopuplist: null
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

    componentDidUpdate() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    onUserListenChange(ev) {
        if(ev.isListening) {
            this.displayNotif(`You are listening to ${ev.name}`);
        } else {
            this.displayNotif(`You are no longer listening to ${ev.name}`, 'warning');
        }
    },

    renderPopuplists() {
        const {username} = this.props.user;
        return (
            <Popuplist open={Boolean(this.state.activePopuplist)}
                       onClose={this.onPopuplistClose}
                       username={username}
                       type={this.state.activePopuplist}
                       />
        );
    },

    onPopuplistClose() {
        this.setState({activePopuplist: null})
    },

    listOnClick(type) {
        return () => {
            this.setState({activePopuplist: type});
        }
    },

    renderForOwner() {
        let user = this.props.user;

        return (
            <Grid fluid={true} className="si-card" style={{paddingTop: "15px"}}>
                <Column fluid={true} clear={true} size="5" onClick={this.listOnClick("Listeners")}>
                    <ListenersButton user={user} />
                </Column>
                <Column fluid={true} size="5" onClick={this.listOnClick("Listening")}>
                    <ListeningButton user={user} />
                </Column>
                <Column fluid={true} size="5" onClick={this.listOnClick("Tags")}>
                    <UserListeningTagsButton user={user}/>
                </Column>
                {this.renderPopuplists()}
            </Grid>
            );
    },

    renderForViewers() {
        let {username} = this.props.user;
        let flux = this.context.flux;

        return (
            <Grid fluid={true} className="si-card" style={{paddingTop: "15px"}}>
                <Column fluid={true} clear={true} size="5">
                    <ListenersButton user={this.props.user} />
                </Column>
                <Column fluid={true} size="5">
                    <MessageButton />
                </Column>
                <Column fluid={true} size="5">
                    <ListenButton username={username} onChange={this.onUserListenChange} flux={flux}/>
                </Column>
                <NotificationSystem ref="notificationSystem" />
            </Grid>
        );
    },

    render() {
        if(this.props.user.is_owner) {
            return this.renderForOwner();
        } else {
            return this.renderForViewers();
        }
    }
        
});