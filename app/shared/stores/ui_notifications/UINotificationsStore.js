import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";
import { LISTEN_TAG_SUCCESS, STOP_LISTEN_TAG_SUCCESS } from "../tags/consts";
import { DISMISS_NOTIFICATION } from "./actionTypes";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      LISTEN_SUCCESS, ({ username }) => this.handleNotification(`You are listening to ${username}`),
      STOP_LISTEN_SUCCESS, ({ username }) => this.handleNotification(`You are no longer listening to ${username}`),
      LISTEN_TAG_SUCCESS, ({ tagName }) => this.handleNotification(`You are listening to ${tagName}`),
      STOP_LISTEN_TAG_SUCCESS, ({ tagName }) => this.handleNotification(`You are no longer listening to ${tagName}`),
      DISMISS_NOTIFICATION, this.handleDismiss
    );
  },

  getNotifications() {
    return this.state.notifications;
  },

  handleNotification(message, autoHide = true) {

    // assign a unique id to this notification
    const id = new Date().getTime();

    // create a new notification object, can be extended with type: alert, message, etc.
    const notification = { message, id };

    // optional: autohide a notification after 4 seconds
    if (autoHide) {
      notification.hideTimeout = setTimeout(
        () => this.flux.actions.dismissNotification(id), 4000
      );
    }

    this.state.notifications.push({ ...notification });

    this.emit("change");
  },

  handleDismiss({ id }) {
    const i = this.state.notifications.findIndex(notification => notification.id === id);
    clearTimeout(this.state.notifications[i].hideTimeout);
    this.state.notifications.splice(i, 1);
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

  getState() {
    return this.state;
  }

});
