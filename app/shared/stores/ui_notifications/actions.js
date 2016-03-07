import { DISMISS_NOTIFICATION, NOTIFY } from "./actionTypes";

export default {

  dismissNotification(id) {
    this.dispatch(DISMISS_NOTIFICATION, id);
  },

  notify(message) {
    this.dispatch(NOTIFY, message);
  }
  
};
