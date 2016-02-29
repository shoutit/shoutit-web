import React from "react";
import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";
import { LISTEN_TAG_SUCCESS, STOP_LISTEN_TAG_SUCCESS } from "../tags/consts";
import { DISMISS_NOTIFICATION, NOTIFY } from "./actionTypes";

import SVGIcon from "../../components/helper/SVGIcon";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      DISMISS_NOTIFICATION, this.handleDismiss,
      NOTIFY, message => this.handleNotification({ message } ),

      LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification({
          message: `You are listening to ${username}`,
          icon: <SVGIcon size="large" name="listen" active />
        }
      ),
      STOP_LISTEN_SUCCESS, ({ username }) =>
        this.handleNotification({
          message: `You are no longer listening to ${username}`,
          icon: <SVGIcon name="listen" on />
        }
      ),
      LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification({
          message: `You are listening to ${tagName}`,
          icon: <SVGIcon name="tag" active />
        }
      ),
      STOP_LISTEN_TAG_SUCCESS, ({ tagName }) =>
        this.handleNotification({
          message: `You are no longer listening to ${tagName}`,
          icon: <SVGIcon name="tag" active />
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

  handleNotification({ message, icon }, autoHide=false) {

    // assign a unique id to this notification
    const id = new Date().getTime();

    // create a new notification object, can be extended with type: alert, message, etc.
    const notification = { message, id, icon };

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
