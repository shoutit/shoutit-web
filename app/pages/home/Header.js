import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { imagesPath } from '../../config';

import Button from '../../forms/Button';
import ProfileAvatar from '../../users/ProfileAvatar';

import './Header.scss';

class HomePageHeader extends Component {
  render() {
    return (
      <div className="HomePageHeader">
        <span className="HomePageHeader-logo">
          <Link to="/">
            <img alt="" height="36" width="113" src={ `${imagesPath}/logo-mark-inverted.png` } />
          </Link>
        </span>
        <span className="HomePageHeader-actions">
          <Button to="/login" startElement={ <ProfileAvatar /> }>
            <FormattedMessage id="pages.home.layout.Header.LoginButton" defaultMessage="Login" />
          </Button>
          <Button className="HomePageHeader-signup" kind="primary" to="/signup">
            <FormattedMessage id="pages.home.layout.Header.SignupButton" defaultMessage="Sign up" />
          </Button>
        </span>
      </div>
    );
  }
}

export default HomePageHeader;
