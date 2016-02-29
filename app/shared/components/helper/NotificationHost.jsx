import React from "react";
import { last } from "lodash/array";

import SVGIcon from "../helper/SVGIcon";

if (process.env.BROWSER) {
  require("styles/components/NotificationHost.scss");
}

const notificationTop = 30; // Same as in NotificationHost.scss

export default class NotificationHost extends React.Component {

  state = {
    activeNotificationId: null
  }

  componentWillReceiveProps(nextProps) {
    const lastNotification = last(nextProps.notifications);
    const { activeNotificationId } = this.state;
    if (lastNotification && lastNotification.id !== activeNotificationId) {
      this.setState({
        activeNotificationId: lastNotification.id
      });
    }
  }

  renderNotification(notification, i) {
    const { activeNotificationId } = this.state;
    const { onDismissClick, notifications } = this.props;
    const isActive = activeNotificationId ?
      activeNotificationId === notification.id :
      notification.id === last(notifications).id;

    return (
      <div
        onClick={ () => this.setState({ activeNotificationId: notification.id })}
        className={ `NotificationHost-notification ${isActive ? " active" : ""}`}
        key={ notification.id }
        style={ { top: notificationTop*i }}>

        <div className="NotificationHost-notificationContent">
          { notification.message }
          <span className="NotificationHost-closeButton">
            <SVGIcon size="small" name="close" onClick={ () => onDismissClick(notification.id) } />
          </span>
        </div>

      </div>
    );
  }

  render() {
    const { notifications } = this.props;

    return (
      <div className="NotificationHost">
        <div className="NotificationHost-wrapper">
          { notifications.map(this.renderNotification.bind(this)) }
        </div>
      </div>
    );
  }

}
