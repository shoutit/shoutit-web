/**
 * Created by Philip on 22.06.2015.
 */

import request from "superagent";

const PREFIX = "/api/notifications";

export default {
        loadNotifications() {
          return request
      .get(PREFIX + "/");
  },

        loadMoreNotifications(query) {
          return this.loadNotifications().query(query);
  },

        resetNotifications() {
          return request
      .post(PREFIX + "/reset");
  },

        readNotification(id) {
          return request
      .post(PREFIX + "/" + id + "/read");
  },

        unreadNotification(id) {
          return request
      .del(PREFIX + "/" + id + "/read");
  }
};
