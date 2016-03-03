import React from "react";
import Fluxxor from "fluxxor";
import { DISMISS_NOTIFICATION, NOTIFY } from "../ui_notifications/actionTypes";
import * as notificationList from "../ui_notifications/notificationList";

import Notification from "../../components/notifications/Notification.jsx";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    Object.keys(notificationList).forEach(name => {
      this.bindActions(name, payload => {
        const notification = notificationList[name](payload, this.handleDismiss, this.flux);
        if (!notification) {
          return;
        }
        let content;
        let options;
        if (typeof notification === "string") {
          content = <Notification>{ notification }</Notification>;
        } else if (notification.type === Notification) {
          content = notification;
        } else if (typeof notification.content === "string") {
          content = <Notification>{ notification.content }</Notification>;
        } else if (notification.content && notification.content.type === Notification) {
          content = notification.content;
        } else {
          console.warn("Could not display notification for %s", name); // eslint-disable-line no-console
          return;
        }
        if (notification.options) {
          options = notification.options;
        }
        this.handleNotification(content, options);
      });
    });

    this.bindActions(
      DISMISS_NOTIFICATION, this.handleDismiss,
      NOTIFY, props => this.handleNotification(<Notification {...props} />)
    );
  },

  getNotifications() {
    return this.state.notifications;
  },

  getState() {
    return this.state;
  },

  handleNotification(content, options) {
    options = { autoHide: true, ...options };
    let id;
    if (options.notificationId) {
      id = options.notificationId;
    } else {
      id = id = new Date().getTime();
    }

    const notification = { id, content };

    // optional: autohide a notification after 4 seconds
    if (options.autoHide) {
      notification.hideTimeout = setTimeout(
        () => this.flux.actions.dismissNotification(id), 4000
      );
    }
    const existingIndex = this.state.notifications.findIndex(notification => notification.id === id);
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

  hydrate() { }

});
