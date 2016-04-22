import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('../styles/ListOverlay.scss');
}

export default function HeaderNotificationsOverlay({ onMarkAsReadClick, unreadCount = 0 }) {
  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          Notifications
          { unreadCount > 0 && <span> ({ unreadCount })</span> }
        </span>
        { unreadCount > 0 ?
          <span className="ListOverlay-action" onClick={ onMarkAsReadClick }>
              Mark All As Read
          </span> : null
        }
      </div>
      <div className="ListOverlay-body">
        <div className="ListOverlay-empty">
          <p>No notifications</p>
        </div>
      </div>
    </div>

  );
}

HeaderNotificationsOverlay.propTypes = {
  onMarkAsReadClick: PropTypes.func,
  unreadCount: PropTypes.number,
};
