import React from "react";

import Button from "../helper/Button.jsx";

export default class VideoCallNotification extends React.Component {

  static propTypes = {
    notification: React.PropTypes.object.isRequired,
    invite: React.PropTypes.object.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  render() {
    const { invite, flux, notification } = this.props;
    const { acceptVideoCallInvite, dismissNotification } = flux.actions;
    return (
      <div>
        This guy wants to start a video call with you.

        <div>
          <Button label="Reject" />
          <Button primary label="Accept call" onClick={ () =>
            acceptVideoCallInvite(invite).then(() => dismissNotification(notification.id))
          } />
        </div>

      </div>
    );
  }

}
