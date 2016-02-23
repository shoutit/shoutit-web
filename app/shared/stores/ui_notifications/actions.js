import { DISMISS_NOTIFICATION } from "./consts";

export default {
  dismissNotification(id) {
    this.dispatch(DISMISS_NOTIFICATION, { id });
  }
};
