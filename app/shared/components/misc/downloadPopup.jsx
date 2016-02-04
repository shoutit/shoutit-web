import React from 'react';
import {Modal} from 'react-bootstrap';
import Icon from '../helper/icon.jsx';

const clientStrings = [
  {s: 'Android', r: /Android/},
  {s: 'iOS', r: /(iPhone|iPad|iPod)/},
  {s: 'Mac OS X', r: /Mac OS X/},
  {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/}
];

export default React.createClass({
  displayName: "DownloadPopup",

  render() {
    let client = this.getClient(),
      downloadImage = null,
      downloadLink = null;

    if (client === "android") {
      downloadImage = (
        <img className="center-block" src="/img/app_preview_android.png"/>
      );
      downloadLink = (
        <a href="https://play.google.com/store/apps/details?id=com.shoutit.app.android">
          <Icon className="center-block" name="playstore"/>
        </a>

      );
    } else if (client === "ios") {
      downloadImage = (
        <img className="center-block" src="/img/app_preview_ios.png"/>
      );
      downloadLink = (
        <a href="https://itunes.apple.com/us/app/shoutit-app/id947017118?mt=8&uo=6&at=&ct="
           target="itunes_store">
          <Icon className="center-block" name="appstore"/>
        </a>
      );
    }

    return (
      <Modal className="downloadPopup" onRequestHide={this.onRequestHide} bsSize="large">
        <div className="modal-header">
          <button onClick={this.onRequestHide} type="button" className="close" data-dismiss="modal"
              aria-label="Close">
            <Icon name="nhan"/>
          </button>
        </div>
        <div className="modal-body downloadPopup center-block">
          {downloadImage}
          <h4>Get Shoutit!</h4>

          <p>Download the <b>free</b> Shoutit app for a better experience!</p>
          {downloadLink}
        </div>
      </Modal>
    );
  },

  onRequestHide() {
    this.props.flux.actions.hideDownloadPopup();
  },

  getClient() {
    let nAgt = window.navigator.userAgent,
      os = null;

    for (let id in clientStrings) {
      let cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    let client = null;

    switch (os) {
      case 'Mac OS X':
      case 'iOS':
        client = "ios";
        break;

      case 'Android':
      default :
        client = "android";
        break;
    }

    return client;
  }
});
