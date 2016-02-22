

export default {
  dismissNotification(id) {
    this.dispatch("DISMISS_NOTIFICATION", { id });
  }
};
