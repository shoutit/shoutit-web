import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Notification from "../notifications/Notification";

if (process.env.BROWSER) {
  require("styles/components/NotificationHost.scss");
}

export default function NotificationHost({ notifications, onDismissClick }) {
  return (
    <div className="NotificationHost">
      <div className="NotificationHost-wrapper">
        <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
          { notifications.map(notification =>
            <Notification
              key={ notification.id }
              notification={ notification }
              onDismissClick={ onDismissClick }
            />
          )}
        </ReactCSSTransitionGroup>
      </div>
    </div>
  );
}
