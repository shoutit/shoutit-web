/**
 * Created by Philip on 22.06.2015.
 */

import consts from "./consts";
import client from "./client";


export default {
        loadNotifications() {
          this.dispatch(consts.LOAD_NOTIFICATIONS);

          client.loadNotifications()
      .end(function (error, res) {
              if (error) {
                this.dispatch(consts.LOAD_NOTIFICATIONS_FAILED, {
                  error
          });
        } else {
                this.dispatch(consts.LOAD_NOTIFICATIONS_SUCCESS, {
                  res
          });
        }
      });
  },

        loadMoreNotifications(before) {
          this.dispatch(consts.LOAD_MORE_NOTIFICATIONS);

          client.loadMoreNotifications({before})
      .end(function (error, res) {
              if (error) {
                this.dispatch(consts.LOAD_MORE_NOTIFICATIONS_FAILED, {
                  error
          });
        } else {
                this.dispatch(consts.LOAD_MORE_NOTIFICATIONS_SUCCESS, {
                  before,
                  res
          });
        }
      });
  },

        resetNotifications() {
          this.dispatch(consts.RESET_NOTIFICATIONS);

          client.resetNotifications()
      .end(function (error) {
              if (error) {
                this.dispatch(consts.RESET_NOTIFICATIONS_FAILED, {
                  error
          });
        } else {
                this.dispatch(consts.RESET_NOTIFICATIONS_SUCCESS);
        }
      });
  },

        readNotification(id) {
          this.dispatch(consts.READ_NOTIFICATION, {
            id
    });

          client.readNotification(id)
      .end(function (error) {
              if (error) {
                this.dispatch(consts.READ_NOTIFICATION_FAILED, {
                  id, error
          });
        } else {
                this.dispatch(consts.READ_NOTIFICATION_SUCCESS, {
                  id
          });
        }
      });
  },

        unreadNotification(id) {
          this.dispatch(consts.UNREAD_NOTIFICATION, {
            id
    });

          client.unreadNotification(id)
      .end(function (error) {
              if (error) {
                this.dispatch(consts.UNREAD_NOTIFICATION_FAILED, {
                  id, error
          });
        } else {
                this.dispatch(consts.UNREAD_NOTIFICATION_SUCCESS, {
                  id
          });
        }
      });
  }

};
