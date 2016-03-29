import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { dismissUINotification } from '../actions/ui';

if (process.env.BROWSER) {
  require('./UINotificationsHost.scss');
}

export function UINotificationsHost({ notifications, dismiss }) {
  return (
    <div className="UINotificationsHost">
      <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
        { notifications.map(notification =>

            React.cloneElement(notification.content, {
              notificationId: notification.id,
              key: notification.id,
              onDismissClick: () => dismiss(notification.id),
            })

          )
        }
      </ReactCSSTransitionGroup>
    </div>
  );
}

const mapStateToProps = state => ({
  notifications: state.uiNotifications,
});

const mapDispatchToProps = dispatch => ({
  dismiss(id) {
    dispatch(dismissUINotification(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UINotificationsHost);
