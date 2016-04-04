import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import Overlay from '../ui/Overlay';
import Button from '../ui/Button';

import HeaderMessagesOverlay from './HeaderMessagesOverlay';
import HeaderNotificationsOverlay from './HeaderNotificationsOverlay';
import HeaderProfileOverlay from './HeaderProfileOverlay';
import HeaderProfile from './HeaderProfile';
import Searchbar from '../search/Searchbar';

import { logout } from '../actions/session';
import { loadConversations } from '../actions/chat';
import { getCountryName } from '../utils/LocationUtils';
import { imagesPath } from '../config';

if (process.env.BROWSER) {
  require('./Header.scss');
}

export class Header extends Component {

  static propTypes = {
    loggedUser: PropTypes.object,
    location: PropTypes.object,
    currentLocation: PropTypes.object,
    unreadConversations: PropTypes.number,
  };

  state = {
    overlayName: null,
  }

  componentDidMount() {
    if (this.props.loggedUser) {
      this.props.dispatch(loadConversations());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location && nextProps.location.key !== this.props.location.key) {
      this.hideOverlay();
    }
    if (nextProps.loggedUser && !this.props.loggedUser) {
      this.props.dispatch(loadConversations());
    }
  }

  showOverlay(e, overlayName) {
    e.preventDefault();
    this.setState({ overlayName, overlayTarget: e.target });
  }

  hideOverlay() {
    this.setState({ overlayName: null, overlayTarget: null });
  }

  render() {
    const { dispatch, loggedUser, unreadConversations, currentLocation } = this.props;

    const { overlayName, overlayTarget } = this.state;

    let discoverLink = '/discover';
    if (currentLocation.country) {
      discoverLink += `/${getCountryName(currentLocation.country).toLowerCase()}`;
    }
    let browseLink = '/search';
    const browseLinkQuery = [];
    if (currentLocation.country) {
      browseLinkQuery.push(`country=${currentLocation.country}`);
    }
    if (currentLocation.state) {
      browseLinkQuery.push(`state=${encodeURIComponent(currentLocation.state)}`);
    }
    if (currentLocation.city) {
      browseLinkQuery.push(`city=${encodeURIComponent(currentLocation.city)}`);
    }
    if (browseLinkQuery.length > 0) {
      browseLink += `?${browseLinkQuery.join('&')}`;
    }

    return (
      <header className="Header">
        <div className="Header-logo">
          <Link to="/">
            <img height="36" width="132" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-links">
          <Link to={ browseLink } activeClassName="Header-link-active">Browse</Link>
          <Link to={ discoverLink } activeClassName="Header-link-active">Discover</Link>
        </div>

        <div className="Header-search">
          <Searchbar />
        </div>

        { loggedUser ?
          <div className="Header-tools loggedIn">
            <HeaderProfile
              onMessagesClick={ e => this.showOverlay(e, 'messages') }
              onProfileClick={ e => this.showOverlay(e, 'profile') }
              onNotificationsClick={ e => this.showOverlay(e, 'notifications') }
              onNewShoutClick={ () => this.setState({ openNewShoutDialog: true }) }
              loggedUser={ loggedUser }
              unreadCount={ unreadConversations }
            />
          </div> :
          <div className="Header-tools loggedOut">
            <Button label="Log in" to="/login" />
            <Button label="Sign up" primary to="/signup" />
          </div>
        }

        { process.env.BROWSER && loggedUser && [

          <Overlay key="messages" arrow rootClose
            style={ { width: 400, marginLeft: 4 }}
            show={ overlayName === 'messages' }
            placement="bottom"
            container={ this }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }
          >
              <HeaderMessagesOverlay />
          </Overlay>,

          <Overlay key="notifications" arrow rootClose
            style={ { width: 400, marginLeft: 4 }}
            show={ overlayName === 'notifications' }
            placement="bottom"
            container={ this }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }
          >
              <HeaderNotificationsOverlay
                unreadCount={ 0 }
                onMarkAsReadClick={ () => { }}
              />
          </Overlay>,

          <Overlay key="profile" rootClose arrow inverted
            placement="bottom"
            container={ this }
            style={ { width: 200, marginLeft: 3 }}
            show={ overlayName === 'profile' }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }
          >
              <HeaderProfileOverlay
                loggedUser={ loggedUser }
                onLogoutClick={ () =>
                  dispatch(logout()).then(() => dispatch(push('/')))
                }
              />
          </Overlay>,
        ]}

      </header>
    );
  }
}

function mapStateToProps(state) {
  const { paginated, currentLocation, session, entities } = state;
  const conversations = paginated.chat.ids.map(id => entities.conversations[id]);
  const unreadConversations = conversations.filter(c => c.unreadMessagesCount > 0).length;
  return {
    currentLocation,
    loggedUser: session.user,
    unreadConversations,
  };
}

export default connect(mapStateToProps)(Header);
