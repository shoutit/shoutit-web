import React from "react";

import Button from "../helper/Button.jsx";

export default class OutgoingVideoCallNotification extends React.Component {

  static propTypes = {
    notification: React.PropTypes.object,
    outgoingInvite: React.PropTypes.object.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleInviteStatusChange = this.handleInviteStatusChange.bind(this);
    this.state = {
      invite: props.outgoingInvite
    };
  }

  componentDidMount() {
    const { outgoingInvite } = this.props;
    outgoingInvite.on("accepted", this.handleInviteStatusChange);
    outgoingInvite.on("canceled", this.handleInviteStatusChange);
    outgoingInvite.on("failed", this.handleInviteStatusChange);
    outgoingInvite.on("rejected", this.handleInviteStatusChange);
  }

  componentWillUnmount() {
    const { outgoingInvite } = this.props;
    outgoingInvite.removeEventListener("accepted", this.handleInviteStatusChange);
    outgoingInvite.removeEventListener("canceled", this.handleInviteStatusChange);
    outgoingInvite.removeEventListener("failed", this.handleInviteStatusChange);
    outgoingInvite.removeEventListener("rejected", this.handleInviteStatusChange);
  }

  handleInviteStatusChange(invite) {
    this.setState({ invite });
  }

  render() {
    // const { outgoingInvite, flux, notification } = this.props;
    // const { acceptVideoCall, rejectVideoCall, dismissNotification } = flux.actions;

    // const dismiss = () => dismissNotification(notification.id);
    const { invite } = this.state;
    return (
      <div>
        Starting video call... { invite.status }
      </div>
    );
  }

}
