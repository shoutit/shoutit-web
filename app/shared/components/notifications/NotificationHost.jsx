import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

if (process.env.BROWSER) {
  require("styles/components/NotificationHost.scss");
}

export default function NotificationHost({ notifications, flux }) {
  return (
    <div className="NotificationHost">
      <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
        { notifications.map(notification =>

            React.cloneElement(notification.content, {
              notificationId: notification.id,
              key: notification.id,
              dismissNotification: () => flux.actions.dismissNotification(notification.id)
            })

          )
        }
      </ReactCSSTransitionGroup>
    </div>
  );
}
