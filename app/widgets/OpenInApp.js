/* eslint-env browser */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { appStoreLink } from '../config';

import './OpenInApp.scss';

class OpenInApp extends Component {

  constructor(props) {
    super(props);
    this.handleOpenClick = this.handleOpenClick.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    hidden: false,
  }

  componentDidMount() {
    this.mounted = true;
  }

  hide() {
    this.setState({ hidden: true });
  }

  handleOpenClick() {
    const el = document.getElementById('shoutitAppUrl');
    if (el) {
      window.open(el.getAttribute('content'), '_self');
    }
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
          <a href={ appStoreLink } target="_blank">
            <FormattedMessage
              id="widgets.OpenInApp.install"
              defaultMessage="Install"
            />
          </a>
          <a onClick={ this.handleOpenClick }>
            <FormattedMessage
              id="widgets.OpenInApp.open"
              defaultMessage="Open in App"
            />
          </a>
        </span>
      </div>
    );
  }
}

export default OpenInApp;
