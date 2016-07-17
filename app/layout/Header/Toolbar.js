import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import MessagesButton from './MessagesButton';
import NotificationsButton from './NotificationsButton';
import ProfileButton from './ProfileButton';
import ProfileAvatar from '../../users/ProfileAvatar';

import Button from '../../forms/Button';
import AddIcon from '../../icons/AddIcon';

// import './Toolbar.scss';

class Toolbar extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    layout: PropTypes.oneOf(['mobile', 'desktop']),
    onNewShoutClick: PropTypes.func.isRequired,
  }
  static defaultProps = {
    layout: 'desktop',
  }
  render() {
    return (
      <div className={ `Header-toolbar ${this.props.layout}` }>

        { this.props.isLoggedIn &&
          <div className="Header-toolbar-loggedIn">
            { this.props.layout === 'desktop' && <MessagesButton overlayContainer={ this } /> }
            { this.props.layout === 'desktop' && <NotificationsButton overlayContainer={ this } /> }
            <ProfileButton />
          </div>
        }

        { !this.props.isLoggedIn &&
          <Button to="/login">
          { this.props.layout === 'desktop' ?
            <FormattedMessage id="layout.Header.LoginButton" defaultMessage="Login" /> :
            <ProfileAvatar />
          }
          </Button>
        }

        <Button
          iconButton={ this.props.layout === 'mobile' }
          kind="primary"
          to={ this.props.isLoggedIn ? undefined : '/signup' }
          onClick={ this.props.isLoggedIn ? this.props.onNewShoutClick : undefined }>
          { this.props.layout === 'mobile' ?
            <AddIcon /> :
            <FormattedMessage id="layout.Header.CreateShoutButton" defaultMessage="Offer / Request" />
           }
        </Button>

      </div>

    );
  }
}

export default Toolbar;
