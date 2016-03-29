/* globals Twilio */

import React from 'react';

const TWILIO_NOT_LOADED = 'TWILIO_NOT_LOADED';

if (process.env.BROWSER) {
  require('./VideoCallLocalMedia.scss');
}

export default class VideoCallLocalMedia extends React.Component {

  state = {
    error: null,
  }

  componentDidMount() {

    if (!Twilio) {
      this.setState({
        error: new Error(TWILIO_NOT_LOADED),
      });
      return;
    }

    const media = new Twilio.Conversations.LocalMedia();

    this.setState({ media }, () => {

      Twilio.Conversations.getUserMedia()
        .then(mediaStream => {
          media.addStream(mediaStream);
          media.attach(this.refs.media);
        })
        .catch(error => {
          this.setState({ error });
        });

    });

  }

  componentWillUnmount() {
    this.state.media.stop();
  }

  render() {
    return (
      <div className="VideoCallLocalMedia" ref="media">
      </div>
    );
  }

}
