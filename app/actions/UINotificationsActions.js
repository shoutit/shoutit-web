import { DISMISS_UI_NOTIFICATION, NOTIFY } from "./actionTypes";

export default {

  dismissUINotification(id) {
    this.dispatch(DISMISS_UI_NOTIFICATION, id);
  },

  notify(message) {
    this.dispatch(NOTIFY, message);
  }

};
