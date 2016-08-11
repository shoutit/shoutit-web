/* eslint-env browser */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getCurrentUrl } from '../reducers/routing';

import { appStoreLink, playStoreLink } from '../config';
import { getOperatingSystem } from '../reducers/browser';

import './OpenInApp.scss';

class OpenInApp extends Component {

  static propTypes = {
    os: PropTypes.string,
    storeLink: PropTypes.string.isRequired,
    currentUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.state = {
      appUrl: props.storeLink,
    };
  }

  state = {
    hidden: false,
  }

  componentDidMount() {
    this.mounted = true;
    this.setAppUrl();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUrl !== prevProps.currentUrl) {
      // reset the app url if the page changed
      this.setAppUrl();
    }
  }

  setAppUrl() {
    const el = document.getElementById(`shoutitAppUrl_${this.props.os}`);
    if (el) {
      this.setState({
        appUrl: el.getAttribute('content'),
      });
    }
  }

  hide() {
    this.setState({ hidden: true });
  }

  render() {
    if (this.state.hidden) {
      return null;
    }
    return (
      <div className="OpenInApp">
        <span className="OpenInApp-Close" onClick={ this.hide }>
          ✕
        </span>
        <span className="OpenInApp-Title">
          <strong>
            Shoutit
          </strong>
          { ' ' }
          <FormattedMessage
            id="widgets.OpenInApp.free"
            defaultMessage="(FREE)"
          />
        </span>
        <span className="OpenInApp-Buttons">
          <a href={ this.state.appUrl }>
            <FormattedMessage
              id="widgets.OpenInApp.open"
              defaultMessage="Open in App"
            />
          </a>
          <a href={ this.props.storeLink } target="_blank">
            <FormattedMessage
              id="widgets.OpenInApp.install"
              defaultMessage="Install"
            />
          </a>
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const os = getOperatingSystem(state);
  let storeLink;
  switch (os) {
    case 'android':
      storeLink = playStoreLink;
      break;
    case 'ios':
      storeLink = appStoreLink;
      break;
    default: break;
  }
  return {
    os,
    storeLink,
    currentUrl: getCurrentUrl(state),
  };
};
export default connect(mapStateToProps)(OpenInApp);
