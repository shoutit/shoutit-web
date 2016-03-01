import React from "react";
import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";
import { LISTEN_TAG_SUCCESS, STOP_LISTEN_TAG_SUCCESS } from "../tags/consts";
import { DISMISS_NOTIFICATION, NOTIFY } from "../ui_notifications/actionTypes";
import { VIDEOCALL_INCOMING, VIDEOCALL_OUTGOING } from "../video_call/actionTypes";

import SVGIcon from "../../components/helper/SVGIcon";
import IncomingVideoCallNotification from "../../components/notifications/IncomingVideoCallNotification.jsx";
import OutgoingVideoCallNotification from "../../components/notifications/OutgoingVideoCallNotification.jsx";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      DISMISS_NOTIFICATION, this.handleDismiss,
      NOTIFY, params => this.handleNotification(params),

      LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification({
          content: <span>You are now listening to <strong>{username}</strong>’s activity.</span>,
          icon: <SVGIcon name="listen" active />
        }
      ),
      STOP_LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification({
          content: <span>You are no longer listening to <strong>{username}</strong>’s activity.</span>,
          icon: <SVGIcon name="listen" on />
        }
      ),
      LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification({
          content: <span>You are now listening to the tag <strong>{tagName}</strong>.</span>,
          icon: <SVGIcon name="tag" active />
        }
      ),
      STOP_LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification({
          content: <span>You are no longer listening to the tag <strong>{tagName}</strong>.</span>,
          icon: <SVGIcon name="tag" active />
        }
      ),

      VIDEOCALL_OUTGOING, ({user, outgoingInvite}) =>
        this.handleNotification({
          content: <OutgoingVideoCallNotification flux={ this.flux } user={ user } outgoingInvite={ outgoingInvite } />,
          autoHide: false,
          dismissable: false,
          icon: <SVGIcon name="video" active />
        }
      ),

      VIDEOCALL_INCOMING, incomingInvite =>
        this.handleNotification({
          content: <IncomingVideoCallNotification flux={ this.flux } incomingInvite={ incomingInvite } />,
          autoHide: false,
          dismissable: false
        }
      )

    );
  },

  getNotifications() {
    return this.state.notifications;
  },

  getState() {
    return this.state;
  },

  handleNotification({ content, icon, dismissable=true, autoHide=true }) {

    // assign a unique id to this notification
    const id = new Date().getTime();

    // create a new notification object, can be extended with type: alert, content, etc.
    const notification = { content, id, icon, dismissable };

    // optional: autohide a notification after 4 seconds
    if (autoHide) {
      notification.hideTimeout = setTimeout(
        () => this.flux.actions.dismissNotification(id), 4000
      );
    }

    this.state.notifications.unshift(notification);

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
