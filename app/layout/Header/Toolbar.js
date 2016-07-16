import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import MessagesButton from './MessagesButton';
import NotificationsButton from './NotificationsButton';
import ProfileButton from './ProfileButton';

import Button from '../../forms/Button';

// import './Toolbar.scss';

class Toolbar extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    small: PropTypes.bool,
    onNewShoutClick: PropTypes.func.isRequired,
  }
  render() {
    return (
      <div className="Header-toolbar">

        { this.props.isLoggedIn &&
          <div className="Header-toolbar-loggedIn">
            { !this.props.small && <MessagesButton overlayContainer={ this } /> }
            { !this.props.small && <NotificationsButton overlayContainer={ this } /> }
            <ProfileButton overlayContainer={ this } />
          </div>
        }

        { !this.props.isLoggedIn &&
          <Button to="/login">
            <FormattedMessage id="layout.Header.LoginButton" defaultMessage="Login" />
          </Button>
        }

        <Button
          kind="primary"
          to={ this.props.isLoggedIn ? undefined : '/signup' }
          onClick={ this.props.isLoggedIn ? this.props.onNewShoutClick : undefined }>
          { this.props.small && '+' }
          { !this.props.small &&
            <FormattedMessage id="layout.Header.CreateShoutButton" defaultMessage="Offer / Request" />
            }
        </Button>

      </div>

    );
  }
}

export default Toolbar;
