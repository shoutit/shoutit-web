import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Icon, Grid, Column, Progress } from '../helper';
import Separator from '../general/separator.jsx';
import NotificationSystem from 'react-notification-system';
import TagProfileImage from '../tag/tagProfileImage.jsx';
import TagListenButton from '../general/tagListenButton.jsx';
import TagListenersButton from '../general/tagListenersButton.jsx';

export default React.createClass({
    displayName: "tagProfileCard",
    mixins: [new StoreWatchMixin('tags')],
    _notificationSystem: null,

    contextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object
    },

    getStateFromFlux() {
        return this.context.flux.store('tags').getState();
    },

    displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

    renderProfile() {
        let tagName = this.context.params.tagName,
            tagEntry = this.state.tags[tagName];

        if (tagEntry) {
            let tag = JSON.parse(JSON.stringify(tagEntry.tag));

            return (
                <Grid fluid={true}>
                    <div className="tag-logo">
                        <Icon name="tag" />
                    </div>
                    <h3 className="tag-name">{tag.name}</h3>
                    <Separator />
                    <Column fluid={true} clear={true} size={5}>
                        <TagListenersButton tag={tag} />
                    </Column>
                    <Column fluid={true} size={5}>
                        {/* make it a component later (category)*/}
                        <div className="si-shelf-button">
                            <div className="img-holder">
                                <Icon name="message" />
                            </div>
                            <div className="text-holder">
                                Computers
                            </div>
                        </div>
                    </Column>
                    <Column fluid={true} size={5}>
                        <TagListenButton tag={tag} onChange={this.handleListen} flux={this.context.flux }/>
                    </Column>
                </Grid>
            );
        } else if (!this.state.loading && tagEntry === null) {
            return (
                <Grid fluid={true}>
                    <h3>Tag not found!</h3>
                </Grid>
            );
        } else {
            return (
                <Grid fluid={true}>
                    <Progress />
                </Grid>
            );
        }
    },

    componentDidUpdate() {
        this.loadTag();
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentDidMount() {
        this.loadTag();
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleListen(ev) {
        if(ev.isListening) {
            this.displayNotif(`You are listening to ${ev.tag}`);
        } else {
            this.displayNotif(`You are no longer listening to ${ev.tag}`, 'warning');
        }
    },

    loadTag() {
        let tagName = this.context.params.tagName,
            tagEntry = this.state.tags[tagName];

        if (!this.state.loading && !tagEntry && tagEntry !== null) {
            this.context.flux.actions.loadTag(tagName);
        }
    },

    render() {
        let isTagProfile = this.context.params.tagName;

        if(isTagProfile) {
            return (
                <section className="si-card tag-profile-card">
                    {this.renderProfile()}
                    <NotificationSystem ref="notificationSystem" />
                </section>
                );
        } else {
            return null;
        }
    }
});
