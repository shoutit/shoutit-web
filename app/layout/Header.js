import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { getCurrentLocation } from '../reducers/currentLocation';
import { isLoggedIn } from '../reducers/session';

import Button from '../forms/Button';

import HeaderMessagesButton from '../header/HeaderMessagesButton';
import HeaderNotificationsButton from '../header/HeaderNotificationsButton';
import HeaderProfileButton from '../header/HeaderProfileButton';
import NewShoutModal from '../shouts/NewShoutModal';
import Searchbar from '../search/Searchbar';
import CountryFlag from '../location/CountryFlag';
import LocationModal from '../location/LocationModal';

import { imagesPath } from '../config';

import { openModal } from '../actions/ui';
import { getLocationPath } from '../utils/LocationUtils';

import './Header.scss';

function getDiscoverLink(location) {
  let link = '/discover';
  if (location.country) {
    link += `/${location.country.toLowerCase()}`;
  }
  return link;
}

export class Header extends Component {

  static propTypes = {
    onNewShoutClick: PropTypes.func.isRequired,
    onLocationClick: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    currentLocation: PropTypes.object,
  };

  render() {
    const { currentLocation, isLoggedIn } = this.props;
    return (
      <header className="Header" style={ { position: 'relative' } }>
        <div className="Header-top">
          <div className="Header-logo">
            <Link to="/">
              <img alt="" height="36" width="113" src={ `${imagesPath}/logo.png` } />
            </Link>
          </div>
          <div className="Header-location" onClick={ this.props.onLocationClick }>
            <CountryFlag code={ currentLocation.country } tooltipPlacement="bottom" size="small" />
            <span>{ currentLocation.city }</span>
          </div>

          <div className="Header-search">
            <Searchbar showLocation={ false } />
          </div>

          <div className="Header-toolbar">

            { isLoggedIn &&
              <div className="Header-toolbar-loggedIn">
                <HeaderMessagesButton overlayContainer={ this } />
                <HeaderNotificationsButton overlayContainer={ this } />
                <HeaderProfileButton overlayContainer={ this } />
              </div>
            }

            { !isLoggedIn &&
              <Button to="/login">
                <FormattedMessage id="layout.Header.LoginButton" defaultMessage="Login" />
              </Button>
            }

            <Button
              kind="primary"
              to={ isLoggedIn ? undefined : '/signup' }
              onClick={ isLoggedIn ? this.props.onNewShoutClick : undefined }>
              <FormattedMessage id="layout.Header.CreateShoutButton" defaultMessage="Offer / Request" />
            </Button>

          </div>
        </div>
        <div className="Navbar">
          <Link to={ `/search${getLocationPath(currentLocation)}` } activeClassName="active">
            <FormattedMessage id="layout.Navbar.browse" defaultMessage="Browse" />
          </Link>
          <Link to={ getDiscoverLink(currentLocation) } activeClassName="active" >
            <FormattedMessage id="layout.Navbar.discover" defaultMessage="Discover" />
          </Link>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({
  onNewShoutClick: () =>
    dispatch(openModal(<NewShoutModal />)),
  onLocationClick: () =>
    dispatch(openModal(<LocationModal />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
