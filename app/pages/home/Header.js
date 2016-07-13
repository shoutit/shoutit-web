import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { imagesPath } from '../../config';

import Button from '../../forms/Button';

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
          <Button to="/login">
            <FormattedMessage id="pages.home.header.loginButton" defaultMessage="Login" />
          </Button>
          <Button kind="primary" to="/signup">
            <FormattedMessage id="pages.home.header.signupButton" defaultMessage="Sign up" />
          </Button>
        </span>
      </div>
    );
  }
}

export default HomePageHeader;
