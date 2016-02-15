import React from 'react';
import Progress from '../helper/Progress.jsx';
import {Icon, Grid} from '../helper';
import DocumentTitle from 'react-document-title';
import TagProfileImage from './tagProfileImage.jsx';
import NotificationSystem from 'react-notification-system';
import assign from 'lodash/object/assign';

export default React.createClass({
  _notificationSystem: null,
  displayName: "TagProfile",

  displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

  render() {
    const tagName = this.props.tagName,
      tagEntry = this.props.tags[tagName];

    if (tagEntry) {
      return (
        <DocumentTitle title={tagName + " - Shoutit"}>
          <Grid fluid={true}>
              {React.cloneElement(this.props.children, this.props)}
          </Grid>
        </DocumentTitle>
      );
    } else if (!this.props.loading && tagEntry === null) {
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
    this._notificationSystem = this.refs.notificationSystem;
  },

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  },

  handleListen(ev) {
    if(ev.isListening) {
      this.displayNotif(`You are listening to ${ev.tag}`);
    } else {
      this.displayNotif(`You are no longer listening to ${ev.tag}`, 'warning');
    }
  }
});
