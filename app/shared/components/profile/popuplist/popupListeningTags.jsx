import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';
import TagRow from './tagRow.jsx';
import {StoreWatchMixin} from 'fluxxor';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
    displayName: "ProfileListeningTags",
    _notificationSystem: null,
    mixins: [ new StoreWatchMixin("tags", "users") ],

    statics: {
        fetchId: 'listeningTags',
        fetchData(client, session, params) {
            return client.users().getListening(session, params.username, {type: 'tags'});
        }
    },

    getStateFromFlux() {
        const userStore = this.props.flux.store("users").getState();

        return {
            tags: this.props.flux.store("tags").getState().tags,
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

    componentDidMount() {
        let username = this.props.username;
        this.props.flux.actions.loadUserListeningTags(username);

        this._notificationSystem = this.refs.notificationSystem;
    },

    render() {
        let username = this.props.params.username,
            tagsList = this.state.listens[username]? this.state.listens[username].tags.list : null,
            tags = this.state.tags,
            listeningTags = [],
            flux = this.props.flux,
            tagsChildren, stat;

        if(tagsList) {
            tagsList.forEach(item => {
                this.state.tags[item]? listeningTags.push(tags[item].tag): undefined; 
            });
        }

        if (listeningTags.length) {
            tagsChildren = listeningTags.length ? 
                listeningTags.map((tag, i) => {
                    return (
                        <TagRow key={"tags-" + '-' + i} tag={tag} onChange={this.handleChange} flux={flux}/>
                    );
                })
                :
                !this.props.loading? <h4>You aren't listening to any other user.</h4>: [];
        } else {
            tagsChildren = <Loader/>;
        }

        return (
            <Col xs={12} md={12} className="content-listener">
                <div className="listener">
                    <div className="listener-title">
                        <p>You are listening to:</p>
                    </div>
                    <Clear/>

                    <div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                        {tagsChildren}
                        {this.renderViewportSensor()}
                    </div>
                </div>
                <NotificationSystem ref="notificationSystem" />
            </Col>
        );
    },

    handleChange(ev) {
        if(ev.isListening) {
            this.displayNotif(`You are listening to ${ev.tag}`);
        } else {
            this.displayNotif(`You are no longer listening to ${ev.tag}`, 'warning');
        }
    },

    renderViewportSensor() {
        if(this.props.loading) {
            return (
                <section>
                        <Col xs={12} md={12}>
                            <Loader />
                        </Col>
                </section>);
        } else {
            return (
                <section>
                    <Col xs={12} md={12}>
                        <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
                    </Col>
                </section>);
        }
    },

    onLastVisibleChange(isVisible) {
        if (isVisible) {
            this.loadMore();
        }
    },

    loadMore() {
        this.props.flux.actions.loadMoreUserListeningTags(this.props.username);
    }
});