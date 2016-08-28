import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../../utils/PropTypes';

import { resetNotifications, loadNotifications, readNotification } from '../../actions/notifications';
import NotificationItem from '../../notifications/NotificationItem';
import ScrollablePaginated from '../../layout/ScrollablePaginated';
import List from '../../layout/List';
import { getPaginationState, getNotifications } from '../../reducers/paginated/notifications';
// import '../../styles/ListOverlay.scss';

export function NotificationsOverlay({ markAllAsRead, notifications = [], pagination, loadNotifications, closeOverlay, markAsRead }) {

  function onNotificationClick(notification) {
    if (!notification.isRead) {
      markAsRead(notification);
    }
    closeOverlay();
  }

  function onMarkAllAsReadClick() {
    markAllAsRead();
    closeOverlay();
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          <span tabIndex={ 0 } className="ListOverlay-action" onClick={ onMarkAllAsReadClick }>
            <FormattedMessage
              id="header.notificationsPopover.read"
              defaultMessage="Mark all as read"
            />
          </span>
        }
      </div>
      <ScrollablePaginated
        className="ListOverlay-body"
        loadData={ loadNotifications }
        showProgress={ pagination.isFetching }
        { ...pagination }>
        { notifications.length > 0 &&
          <List>
          { notifications.map(notification =>
            <NotificationItem
              key={ notification.id }
              notification={ notification }
              onClick={ () => onNotificationClick(notification) }
            />
          )}
          </List>
        }
        { notifications.length === 0 && !pagination.isFetching &&
          <div className="ListOverlay-empty">
            <p>
              <FormattedMessage
                id="scrollableNotifications.empty"
                defaultMessage="No notifications"
              />
            </p>
          </div>
        }
      </ScrollablePaginated>
    </div>

  );
}

NotificationsOverlay.propTypes = {
  notifications: PropTypes.array,
  loadNotifications: PropTypes.func.isRequired,
  pagination: PropTypes.shape(PaginationPropTypes),

  markAsRead: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  closeOverlay: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notifications: getNotifications(state),
  pagination: getPaginationState(state, 'notifications'),
});

const mapDispatchToProps = dispatch => ({
  loadNotifications: params => dispatch(loadNotifications(params)),
  markAsRead: notification => dispatch(readNotification(notification)),
  markAllAsRead: () => dispatch(resetNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsOverlay);
