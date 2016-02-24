import React from "react";

if (process.env.BROWSER) {
  require("styles/components/NotificationHost");
}

export default function NotificationHost({ notifications, onDismissClick }) {
  return (
    <div className="NotificationHost">
      { notifications.map((notification, idx) =>
        <div className="NotificationHost-notification" key={`ui-notif-${idx}`}>
          { notification.message }
          <button onClick={ () => onDismissClick(notification.id) }>Dismiss</button>
        </div>
      )}
    </div>
  );
}
