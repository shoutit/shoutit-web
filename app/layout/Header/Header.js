import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getCurrentLocation } from '../../reducers/currentLocation';
import { isLoggedIn } from '../../reducers/session';
import { getDevice } from '../../reducers/browser';

import NewShoutModal from '../../shouts/NewShoutModal';
import Searchbar from '../../search/Searchbar';
import LocationModal from '../../location/LocationModal';

import { openModal } from '../../actions/ui';

import Navbar from './Navbar';
import Toolbar from './Toolbar';
import Location from './Location';
import Logo from './Logo';

import './Header.scss';

export class Header extends Component {

  static propTypes = {
    onNewShoutClick: PropTypes.func.isRequired,
    onLocationClick: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    currentLocation: PropTypes.object,
    device: PropTypes.oneOf(['desktop', 'smartphone', 'tablet']),
  };

  renderDesktopHeader() {
    return (
      <header className="Header desktop">
        <div className="Header-top">
          <Logo />
          <Location location={ this.props.currentLocation } onClick={ this.props.onLocationClick } />
          <div className="Header-search">
            <Searchbar showLocation={ false } />
          </div>
          <Toolbar layout="desktop" isLoggedIn={ this.props.isLoggedIn } onNewShoutClick={ this.props.onNewShoutClick } />
        </div>
        <Navbar location={ this.props.currentLocation } />
      </header>
    );
  }

  renderMobileHeader() {
    return (
      <header className="Header mobile">
        <div className="Header-top">
          <Logo />
          <Location hideCity location={ this.props.currentLocation } onClick={ this.props.onLocationClick } />
          <Toolbar layout="mobile" isLoggedIn={ this.props.isLoggedIn } onNewShoutClick={ this.props.onNewShoutClick } />
        </div>
        <div className="Header-search">
          <Searchbar autosuggest={ false } showLocation={ false } />
        </div>
        <Navbar location={ this.props.currentLocation } />
      </header>
    );
  }
  render() {
    return this.props.device === 'desktop' ? this.renderDesktopHeader() : this.renderMobileHeader();
  }
}

const mapStateToProps = state => ({
  device: getDevice(state),
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
