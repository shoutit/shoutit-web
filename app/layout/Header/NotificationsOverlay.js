import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import ScrollableNotifications from '../../notifications/ScrollableNotifications';
import { getNotifications } from '../../reducers/paginated/notifications';
import { resetNotifications } from '../../actions/notifications';

import '../../styles/ListOverlay.scss';

export function NotificationsOverlay({ reset, closeOverlay, unreadCount = 0 }) {
  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          <FormattedMessage
            id="header.notificationsPopover.title"
            defaultMessage="Notifications"
          />
        </span>
        { unreadCount > 0 &&
          <span tabIndex={ 0 } className="ListOverlay-action" onClick={ () => reset() && closeOverlay() }>
            <FormattedMessage
              id="header.notificationsPopover.read"
              defaultMessage="Mark all as read"
            />
          </span>
        }
      </div>
      <div className="ListOverlay-body">
        <ScrollableNotifications onNotificationClick={ closeOverlay } />
      </div>
    </div>

  );
}

NotificationsOverlay.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsOverlay);
