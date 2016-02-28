import React from "react";

if (process.env.BROWSER) {
  require("styles/components/VideoCallHost.scss");
}

export default class VideoCallHost extends React.Component {

  constructor(props) {
    super(props);
    this.handlePartecipantConnected = this.handlePartecipantConnected.bind(this);
  }

  componentDidMount() {
    const { conversation } = this.props;
    conversation.localMedia.attach(this.refs.localMedia);
    conversation.addListener("participantConnected", this.handlePartecipantConnected);
  }

  componentWillUnmount() {
    const { conversation } = this.props;
    conversation.removeListener("participantConnected", this.handlePartecipantConnected);
  }

  handlePartecipantConnected(partecipant) {
    partecipant.media.attach(this.refs.remoteMedia);
  }

  render() {
    return (
      <div className="VideoCallHost">
        <div className="VideoCallHost-remoteMedia" ref="remoteMedia"></div>
        <div className="VideoCallHost-localMedia" ref="localMedia"></div>
      </div>
    );
  }

}
