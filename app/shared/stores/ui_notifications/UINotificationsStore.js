import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";
import { DISMISS_NOTIFICATION } from "./consts";
import { findIndex } from "lodash/array";

const initialState = {
  notifications: []
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      LISTEN_SUCCESS, ({ username }) => this.handleNotification(`You are listening to ${username}`),
      STOP_LISTEN_SUCCESS, ({ username }) => this.handleNotification(`You are not longer listening to ${username}`),
      DISMISS_NOTIFICATION, this.onDismissNotification
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

  onDismissNotification({ id }) {
    const indexId = findIndex(this.state.notifications, (chr) => chr.id === id);
    clearTimeout(this.state.notifications[indexId].hideTimeout);
    // Remove the element from array
    this.state.notifications.splice(indexId, 1);

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
