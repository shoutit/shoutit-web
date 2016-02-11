import React from "react";
import { Link } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/ListOverlay.scss");
}

export default function HeaderNotificationsOverlay({ onMarkAsReadClick }) {
  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          Notifications
        </span>
        <span className="ListOverlay-action" onClick={ onMarkAsReadClick }>
            Mark All As Read
        </span>
      </div>
      <div className="ListOverlay-body">
        List
      </div>
      <div className="ListOverlay-footer">
        <Link to="/messages">
          See All
        </Link>
      </div>
    </div>

  );
}
