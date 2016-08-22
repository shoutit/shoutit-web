import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { PaginationPropTypes } from '../utils/PropTypes';

import Scrollable from '../layout/Scrollable';
import { loadNotifications, readNotification } from '../actions/notifications';

import { getPaginationState, getNotifications } from '../reducers/paginated/notifications';
import NotificationItem from './NotificationItem';
import Progress from '../widgets/Progress';

import './ScrollableNotifications.scss';

export class ScrollableNotifications extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    markAsRead: PropTypes.func.isRequired,
    onNotificationClick: PropTypes.func,

    notifications: PropTypes.array,

    error: PropTypes.object,
    ...PaginationPropTypes,
  };

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  componentDidMount() {
    this.props.loadData();
  }

  handleScrollBottom() {
    if (this.props.nextUrl) {
      this.props.loadData(this.props.nextUrl);
    }
  }

  handleNotificationClick(notification, e) {
    if (!notification.isRead) {
      this.props.markAsRead(notification);
    }
    if (this.props.onNotificationClick) {
      this.props.onNotificationClick(e);
    }
  }

  render() {
    const { isFetching, notifications } = this.props;
    const uniqueId = notifications.length > 0 ? notifications[notifications.length - 1].id : 'empty';
    return (
      <Scrollable
        preventDocumentScroll
        uniqueId={ uniqueId }
        className="ScrollableNotifications"
        onScrollBottom={ this.handleScrollBottom }>
        <ul className="Notifications-list">
          { notifications.length > 0 &&
            notifications.map(notification =>
              <NotificationItem
                key={ notification.id }
                notification={ notification }
                onClick={ this.handleNotificationClick.bind(this, notification) }
              />
            ) }
            { !isFetching && notifications.length === 0 &&
              <div className="ListOverlay-empty">
                <p>
                  <FormattedMessage
                    id="scrollableNotifications.empty"
                    defaultMessage="No notifications"
                  />
                </p>
              </div>
            }
          <Progress animate={ isFetching } />
        </ul>
      </Scrollable>
    );
  }
}

const mapStateToProps = state => ({
  notifications: getNotifications(state),
  ...getPaginationState(state, 'notifications'),
});

const mapDispatchToProps = dispatch => ({
  loadData: endpoint => dispatch(loadNotifications(endpoint)),
  markAsRead: notification => dispatch(readNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScrollableNotifications);
