import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Loader} from '../../helper';
import ListenerRow from './listenerRow.jsx';
import ViewportSensor from '../../misc/ViewportSensor.jsx';
import NotificationSystem from 'react-notification-system';
import Dialog from 'material-ui/lib/dialog';
import popuplistHelper from './popuplistHelpers';

export default React.createClass({
    displayName: "PopupList",
    _notificationSystem: null,
    mixins: [ StoreWatchMixin('users', 'tags') ],

    propTypes: {
        username: React.PropTypes.string.isRequired,
        type: React.PropTypes.oneOf(['Listeners', 'Listening', 'Tags']),
        open: React.PropTypes.bool.isRequired
    },

    contextTypes: {
        flux: React.PropTypes.object
    },

    getStateFromFlux() {
        const {flux} = this.context;
        const userStore = flux.store("users").getState();

        return {
            tags: flux.store("tags").getState().tags,
            users: userStore.users,
            user: userStore.user,
            listens: userStore.listens,
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

    componentWillMount() {
        // Initializing helper
        this.helper = popuplistHelper(this.props.type, this.props.username);
    },

    componentDidUpdate(prevProps) {
        const {type, username} = this.props;
        const {flux} = this.context;
        // Initializing helper
        this.helper = popuplistHelper(type, username);
        // condition to send action
        if(prevProps.type !== type || prevProps.username !== username) {
            switch(type) {
            case 'Listeners':
                flux.actions.loadUserListeners(username);
                break;
            case 'Listening':
                flux.actions.loadUserListening(username);
                break;
            case 'Tags':
                flux.actions.loadUserListeningTags(username);
                break;
            }
        }
        
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleChange() {

    },

    handleClose() {
        if(this.props.onClose) {
            this.props.onClose();
        }
    },

    render() {
        const title = this.helper.getTitle();
        const list = this.helper.getList(this.state);

        return(
            <Dialog
              title={title}
              contentClassName="profile-picture-dialog"
              modal={false}
              open={this.props.open}
              autoScrollBodyContent
              onRequestClose={this.handleClose}>
              {list?
                this.props.type === "tags"?
                    list.map((tag, idx) => {
                        return (
                            <TagRow key={"tags-" + '-' + idx}
                                tag={tag} 
                                onChange={this.handleChange} 
                                flux={this.context.flux}/>
                            );
                    })
                    :
                    /* Could be listeners or listenings - both use ListenerRow component*/
                    list.map((item, idx) => {
                        return( 
                            <ListenerRow key={"listen-" + '-' + idx} user={item}
                                    onChange={this.handleChange} />
                            );
                    })
                :
                <Loader />
              }
            </Dialog>
            );
    }

});