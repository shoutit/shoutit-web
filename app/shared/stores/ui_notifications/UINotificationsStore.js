import Fluxxor from "fluxxor";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../users/consts";

const initialState = {
  notifications: {}
};

export const UINotificationsStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      LISTEN_SUCCESS, user => this.handleNotification(`You are listening to ${user.username}`),
      STOP_LISTEN_SUCCESS, user => this.handleNotification(`You are not longer listening to ${user.username}`)

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
        () => this.dismissNotification(id), 4000
      );
    }

    this.state.notifications.push({
      [id]: notification
    });

    this.emit("change");
  },

  dismissNotification(id) {
    clearTimeout(this.state.notifications[id].hideTimeout);
    delete this.state.notification[id];
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
