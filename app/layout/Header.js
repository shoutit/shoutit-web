import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import SVGIcon from '../ui/SVGIcon';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

import HeaderMessagesButton from '../header/HeaderMessagesButton';
import HeaderNotificationsButton from '../header/HeaderNotificationsButton';
import HeaderProfileButton from '../header/HeaderProfileButton';
import CreateShout from '../shouts/CreateShout';
import Searchbar from '../search/Searchbar';

import { getCountryName } from '../utils/LocationUtils';
import { imagesPath } from '../config';

import { openModal, closeModal } from '../actions/ui';

if (process.env.BROWSER) {
  require('./Header.scss');
}

function getBrowseLink(location) {
  let link = '/search';
  const query = [];
  if (location.country) {
    query.push(`country=${location.country}`);
  }
  if (location.state) {
    query.push(`state=${encodeURIComponent(location.state)}`);
  }
  if (location.city) {
    query.push(`city=${encodeURIComponent(location.city)}`);
  }
  if (query.length > 0) {
    link += `?${query.join('&')}`;
  }
  return link;
}

function getDiscoverLink(location) {
  let link = '/discover';
  if (location.country) {
    link += `/${getCountryName(location.country).toLowerCase()}`;
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

    const modal = (
      <Modal name="new-shout">
        <CreateShout
          modalName="new-shout"
          onCancel={ () => dispatch(closeModal('new-shout'))}
          onSuccess={ () => dispatch(closeModal('new-shout'))}
        />
      </Modal>
    );

    dispatch(openModal(modal));

  }

  render() {
    return (
      <header className="Header" style={{ position: 'relative' }}>
        <div className="Header-logo">
          <Link to="/">
            <img height="36" width="132" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-links">
          <Link to={ getBrowseLink(this.props.currentLocation) } activeClassName="Header-link-active">Browse</Link>
          <Link to={ getDiscoverLink(this.props.currentLocation) } activeClassName="Header-link-active">Discover</Link>
        </div>

        <div className="Header-search">
          <Searchbar />
        </div>

        { this.props.isLoggedIn ?
          <div className="Header-tools loggedIn">
            <HeaderMessagesButton overlayContainer={ this } />
            <HeaderNotificationsButton overlayContainer={ this } />
            <Button
              onClick={ this.handleNewShoutClick }
              primary
              size="small"
              label="Create Shout"
              leftIcon={ <SVGIcon name="sparkle" fill /> } />
            <HeaderProfileButton overlayContainer={ this } />
          </div> :
          <div className="Header-tools loggedOut">
            <Button label="Log in" to="/login" />
            <Button label="Sign up" primary to="/signup" />
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
