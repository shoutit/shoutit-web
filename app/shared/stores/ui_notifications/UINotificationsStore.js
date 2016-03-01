import React from "react";
import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";
import { LISTEN_TAG_SUCCESS, STOP_LISTEN_TAG_SUCCESS } from "../tags/consts";
import { DISMISS_NOTIFICATION, NOTIFY } from "../ui_notifications/actionTypes";

import { VIDEOCALL_INCOMING, VIDEOCALL_OUTGOING, VIDEOCALL_OUTGOING_FAILURE, VIDEOCALL_OUTGOING_SUCCESS, VIDEOCALL_INCOMING_ACCEPTED, VIDEOCALL_INCOMING_REJECTED } from "../video_call/actionTypes";

import SVGIcon from "../../components/helper/SVGIcon";
import Button from "../../components/helper/Button.jsx";

import Notification from "../../components/notifications/Notification.jsx";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      DISMISS_NOTIFICATION, this.handleDismiss,
      NOTIFY, props => this.handleNotification(<Notification {...props} />),

      LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification(
          <Notification
            message={ <span>You are now listening to <strong>{username}</strong>’s activity.</span> }
            icon= { <SVGIcon name="listen" active /> }
          />
        ),

      STOP_LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification(
          <Notification
            message={ <span>You are no longer listening to <strong>{username}</strong>’s activity.</span> }
            icon= { <SVGIcon name="listen" on /> }
          />
        ),

      LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification(
          <Notification
            message={ <span>You are now listening to the tag <strong>{tagName}</strong>.</span> }
            icon= { <SVGIcon name="tag" active /> }
          />
        ),

      STOP_LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification(
          <Notification
            message={ <span>You are no longer listening to the tag <strong>{tagName}</strong>.</span> }
            icon= { <SVGIcon name="tag" active /> }
          />
        ),

      VIDEOCALL_OUTGOING, ({ user, videoCallId }) =>
        this.handleNotification(
          <Notification
            dismissable={ false }
            message={ <span>Starting video call with <strong>{ user.name }</strong>...</span> }
            icon= { <SVGIcon name="video" active /> }
            buttons={[]}
          />, { autoHide: false, id: videoCallId }),

      VIDEOCALL_OUTGOING_FAILURE, ({ user, videoCallId }) =>
        this.handleNotification(
          <Notification
            message={ <span>Cannot start video call with <strong>{ user.name }</strong>!</span> }
            icon= { <SVGIcon name="video" active /> }
          />, { autoHide: false, id: videoCallId }),

      VIDEOCALL_OUTGOING_SUCCESS, ({ videoCallId }) => this.handleDismiss(videoCallId),

      VIDEOCALL_INCOMING, incomingInvite =>
        this.handleNotification(
          <Notification
            message="Someone wants to call you!"
            dismissable={ false }
            buttons={[
              <Button size="small" label="Reject" onClick={ () => this.flux.actions.rejectVideoCall(incomingInvite) } />,
              <Button size="small" primary label="Accept" onClick={ () => this.flux.actions.acceptVideoCall(incomingInvite) } />
            ]}
            icon= { <SVGIcon name="video" active /> }
          />, { autoHide: false, id: incomingInvite.conversationSid }),

      VIDEOCALL_INCOMING_ACCEPTED, ({incomingInvite}) => this.handleDismiss(incomingInvite.conversationSid),
      VIDEOCALL_INCOMING_REJECTED, ({incomingInvite}) => this.handleDismiss(incomingInvite.conversationSid)

    );
  },

  getNotifications() {
    return this.state.notifications;
  },

  getState() {
    return this.state;
  },

  handleNotification(content, options) {

    // assign a unique id to this notification if not passed by the options
    const id = new Date().getTime();

    options = { autoHide: false, id, ...options };

    const notification = { id: options.id, content };

    // optional: autohide a notification after 4 seconds
    if (options.autoHide) {
      notification.hideTimeout = setTimeout(
        () => this.flux.actions.dismissNotification(options.id), 4000
      );
    }
    const existingIndex = this.state.notifications.findIndex(notification => notification.id === options.id);
    if (existingIndex > -1) {
      this.state.notifications[existingIndex] = notification;
    } else {
      this.state.notifications.unshift(notification);
    }

    this.emit("change");
  },

  handleDismiss(id) {
    const i = this.state.notifications.findIndex(notification => notification.id === id);
    clearTimeout(this.state.notifications[i].hideTimeout);
    this.state.notifications.splice(i, 1);
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(null);
  },

  hydrate() {

  }


});
