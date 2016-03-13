import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

if (process.env.BROWSER) {
  require("./UINotificationsHost.scss");
}

export default function UINotificationsHost({ notifications, flux }) {
  return (
    <div className="UINotificationsHost">
      <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
        { notifications.map(notification =>

            React.cloneElement(notification.content, {
              notificationId: notification.id,
              key: notification.id,
              dismissUINotification: () => flux.actions.dismissUINotification(notification.id)
            })

          )
        }
      </ReactCSSTransitionGroup>
    </div>
  );
}
