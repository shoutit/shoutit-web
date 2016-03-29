import React from 'react';
import Fluxxor from 'fluxxor';
import { DISMISS_UI_NOTIFICATION, NOTIFY } from '../actions/actionTypes';
import * as notifications from '../ui/UINotificationsList';

import UINotification from '../ui/UINotification';

const initialState = {
  notifications: []
};

export default Fluxxor.createStore({

  initialize() {
    this.state = { ...initialState };

    Object.keys(notifications).forEach(name => {
      this.bindActions(name, payload => {
        const notification = notifications[name](payload, this.handleDismiss, this.flux);
        if (!notification) {
          return;
        }
        let content;
        let options;
        if (typeof notification === 'string') {
          content = <UINotification>{ notification }</UINotification>;
        } else if (notification.type === UINotification) {
          content = notification;
        } else if (typeof notification.content === 'string') {
          content = <UINotification>{ notification.content }</UINotification>;
        } else if (notification.content && notification.content.type === UINotification) {
          content = notification.content;
        } else {
          console.warn('Could not display notification for %s', name); // eslint-disable-line no-console
          return;
        }
        if (notification.options) {
          options = notification.options;
        }
        this.handleNotification(content, options);
      });
    });

    this.bindActions(
      DISMISS_UI_NOTIFICATION, this.handleDismiss,
      NOTIFY, props => this.handleNotification(<UINotification {...props} />)
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
        () => this.flux.actions.dismissUINotification(id), 4000
      );
    }
    const existingIndex = this.state.notifications.findIndex(notification => notification.id === id);
    if (existingIndex > -1) {
      this.state.notifications[existingIndex] = notification;
    } else {
      this.state.notifications.unshift(notification);
    }

    this.emit('change');
  },

  handleDismiss(id) {
    const i = this.state.notifications.findIndex(notification => notification.id === id);
    clearTimeout(this.state.notifications[i].hideTimeout);
    this.state.notifications.splice(i, 1);
    this.emit('change');
  }

});
