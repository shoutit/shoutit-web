import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import Button from '../ui/Button';

import HeaderMessagesButton from '../header/HeaderMessagesButton';
import HeaderNotificationsButton from '../header/HeaderNotificationsButton';
import HeaderProfileButton from '../header/HeaderProfileButton';
import NewShoutModal from '../shouts/NewShoutModal';
import Searchbar from '../search/Searchbar';

import { imagesPath } from '../config';

import { openModal } from '../actions/ui';
import { getLocationPath } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  require('./Header.scss');
}

function getDiscoverLink(location) {
  let link = '/discover';
  if (location.country) {
    link += `/${location.country.toLowerCase()}`;
  }
  return link;
}

export class Header extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    currentLocation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleNewShoutClick = this.handleNewShoutClick.bind(this);

  }

  handleNewShoutClick() {
    const { dispatch } = this.props;
    dispatch(openModal(<NewShoutModal />));
  }

  render() {
    const { currentLocation, isLoggedIn } = this.props;
    return (
      <header className="Header" style={ { position: 'relative' } }>
        <div className="Header-logo">
          <Link to="/">
            <img alt="" height="36" width="132" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-links">
          <Link to={ `/search${getLocationPath(currentLocation)}` } activeClassName="Header-link-active">
            <FormattedMessage id="header.navbar.search" defaultMessage="Browse" />
          </Link>
          <Link to={ getDiscoverLink(currentLocation) } activeClassName="Header-link-active">
            <FormattedMessage id="header.navbar.discover" defaultMessage="Discover" />
          </Link>
        </div>

        <div className="Header-search">
          <Searchbar />
        </div>

        { isLoggedIn ?
          <div className="Header-tools loggedIn">
            <HeaderMessagesButton overlayContainer={ this } />
            <HeaderNotificationsButton overlayContainer={ this } />
            <Button action="primary" size="small" icon="sparkle" onClick={ this.handleNewShoutClick }>
              <FormattedMessage id="header.createShoutButton" defaultMessage="Create Shout" />
            </Button>
            <HeaderProfileButton overlayContainer={ this } />
          </div> :
          <div className="Header-tools loggedOut">
            <Button to="/login">
              <FormattedMessage id="header.loginButton" defaultMessage="Login" />
            </Button>
            <Button action="primary" to="/signup">
              <FormattedMessage id="header.signupButton" defaultMessage="Sign up" />
            </Button>
          </div>
        }

      </header>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  isLoggedIn: !!state.session.user,
});

export default connect(mapStateToProps)(Header);
