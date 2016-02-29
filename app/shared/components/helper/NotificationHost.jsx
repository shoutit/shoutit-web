import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

if (process.env.BROWSER) {
  require("styles/components/NotificationHost.scss");
}

export default function NotificationHost({ notifications, onDismissClick }) {
  return (
    <div className="NotificationHost">
      <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={100} transitionLeaveTimeout={200}>
      { notifications.map((notification, idx) =>
        <div className="NotificationHost-notification" key={`ui-notif-${idx}`}>
          { notification.message }
          <button className="NotificationHost-closeButton" onClick={ () => onDismissClick(notification.id) }>X</button>
        </div>
      )}
      </ReactCSSTransitionGroup>
    </div>
  );
}
