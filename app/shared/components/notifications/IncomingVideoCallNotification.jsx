import React from "react";

import Button from "../helper/Button.jsx";

export default class IncomingVideoCallNotification extends React.Component {

  static propTypes = {
    notification: React.PropTypes.object.isRequired,
    incomingInvite: React.PropTypes.object.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  render() {
    const { incomingInvite, flux, notification } = this.props;
    const { acceptVideoCall, rejectVideoCall, dismissNotification } = flux.actions;

    const dismiss = () => dismissNotification(notification.id);

    return (
      <div>
        This guy wants to start a video call with you.

        <div>
          <Button label="Reject" onClick={ () =>
            rejectVideoCall(incomingInvite).then(dismiss)
          } />
          <Button primary label="Accept call" onClick={ () =>
            acceptVideoCall(incomingInvite).then(dismiss)
          } />
        </div>

      </div>
    );
  }

}
