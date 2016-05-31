import React, { PropTypes } from 'react';
import ScrollableNotifications from '../notifications/ScrollableNotifications';
import { connect } from 'react-redux';
import { getNotifications } from '../selectors';
import { resetNotifications } from '../actions/notifications';

if (process.env.BROWSER) {
  require('../styles/ListOverlay.scss');
}

export function HeaderNotificationsOverlay({ reset, closeOverlay, unreadCount = 0 }) {
  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          Notifications
        </span>
        { unreadCount > 0 &&
          <span tabIndex={ 0 } className="ListOverlay-action" onClick={ () => reset() && closeOverlay() }>
            Mark all as read
          </span>
        }
      </div>
      <div className="ListOverlay-body">
        <ScrollableNotifications onNotificationClick={ closeOverlay } />
      </div>
    </div>

  );
}

HeaderNotificationsOverlay.propTypes = {
  reset: PropTypes.func.isRequired,
  closeOverlay: PropTypes.func.isRequired,
  unreadCount: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  unreadCount: getNotifications(state).filter(notification => !notification.isRead).length,
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(resetNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNotificationsOverlay);
