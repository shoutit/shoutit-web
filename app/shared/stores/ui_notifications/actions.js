import { DISMISS_NOTIFICATION } from "./actionTypes";

export default {
  dismissNotification(id) {
    this.dispatch(DISMISS_NOTIFICATION, { id });
  }
};
