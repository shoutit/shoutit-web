import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import Progress from '../helper/Progress.jsx';
import {Icon, Grid} from '../helper';
import DocumentTitle from 'react-document-title';
import TagProfileImage from './tagProfileImage.jsx';
import NotificationSystem from 'react-notification-system';
import assign from 'lodash/object/assign';

let STORE_NAME = "tags";

export default React.createClass({
  mixins: [new StoreWatchMixin(STORE_NAME)],
  _notificationSystem: null,
  displayName: "TagProfile",

  statics: {
    fetchId: 'tag',
    fetchData(client, session, params) {
      return client.tags().get(session, params.tagName);
    }
  },

  getStateFromFlux() {
    return this.props.flux.store(STORE_NAME).getState();
  },

  displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

  render() {
    let tagName = this.props.params.tagName,
      tagEntry = this.state.tags[tagName];

    if (tagEntry) {
      let linkParams = {tagName: encodeURIComponent(tagName)},
        tag = JSON.parse(JSON.stringify(tagEntry.tag)),
        listenerCount = tag.listeners_count,
        childProps = assign({tagName: tagName, flux: this.props.flux},this.state);

      return (
        <DocumentTitle title={tag.name + " - Shoutit"}>
          <Grid fluid={true}>
              {React.cloneElement(this.props.children, childProps)}
          </Grid>
        </DocumentTitle>
      );
    } else if (!this.state.loading && tagEntry === null) {
      return (
        <DocumentTitle title="Not Found - Shoutit">
          <Grid fluid={true}>
            <h3>Tag not found!</h3>
          </Grid>
        </DocumentTitle>
      );
    } else {
      return (
        <DocumentTitle title="Loading - Shoutit">
          <Grid fluid={true}>
            <Progress/>
          </Grid>
        </DocumentTitle>
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
    let tagName = this.props.params.tagName,
      tagEntry = this.state.tags[tagName];

    if (!this.state.loading && !tagEntry && tagEntry !== null) {
      this.props.flux.actions.loadTag(tagName);
    }
  }
});
