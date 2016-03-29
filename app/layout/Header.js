import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Dialog from '../shared/components/helper/Dialog';
import Overlay from '../shared/components/helper/Overlay';
import Button from '../ui/Button';
import SearchBar from './searchBar.jsx';

import HeaderMessagesOverlay from './HeaderMessagesOverlay';
import HeaderNotificationsOverlay from './HeaderNotificationsOverlay';
import HeaderProfileOverlay from './HeaderProfileOverlay';
import HeaderProfile from './HeaderProfile';
import HeaderNewShout from './HeaderNewShout';

import { logout } from '../actions/session';
import { loadConversations } from '../actions/chat';

import { imagesPath } from '../config';

if (process.env.BROWSER) {
  require('styles/components/header.scss');
}

export class Header extends Component {

  static propTypes = {
    // flux: PropTypes.object.isRequired,
    // loggedUser: PropTypes.object,
    // location: PropTypes.object,
    // chat: PropTypes.object,
    // currentLocation: PropTypes.object
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

  handleBrowseClick(e) {
    e.preventDefault();
    const { currentLocation, flux, history } = this.props;
    const query = {
      city: currentLocation && currentLocation.city ?
        encodeURIComponent(currentLocation.city) : undefined,
      country: currentLocation && currentLocation.country ?
        encodeURIComponent(currentLocation.country) : undefined,
    };
    history.pushState(null, '/search/all/all', query);
    flux.actions.searchShouts({
      category: 'all', shouttype: 'all', ...query,
    });
  }

  render() {
    const { dispatch, loggedUser, unreadConversations, chat, currentLocation = {}, location, history } = this.props;

    const { country } = currentLocation;
    const { overlayName, overlayTarget, openNewShoutDialog } = this.state;
    return (
      <header className="Header">
        <div className="Header-logo">
          <Link to="/">
            <img height="36" width="132" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-search">
          {/* <SearchBar
            currentLocation={ currentLocation }
            height="36"
            flux={ flux }
            history={ history }
          />*/}
        </div>

        <div className="Header-links">
          <span className="Header-separator" />
          <Button onClick={ e => this.handleBrowseClick(e) } label="Browse" />
          <Button to={ '/discover' + (country ? ('/' + country.toLowerCase()) : '') } label="Discover" />
          { loggedUser && <span className="Header-separator" /> }
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
            <Button
              label="Log in"
              to="/login"
              onClick={ e => {
                e.preventDefault();
                history.pushState({ modal: 'login' }, location.pathname);
              }}
            />
            <Button
              label="Sign up"
              primary
              to="/signup"
              onClick={ e => {
                e.preventDefault();
                history.pushState({ modal: 'signup' }, location.pathname);
              }}
            />
          </div>
        }

        { process.env.BROWSER && loggedUser && [

          <Overlay key="messages" arrow rootClose
            style={ { width: 400, marginLeft: 4 }}
            show={ overlayName === 'messages' }
            placement="bottom"
            container={ this }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }>
              <HeaderMessagesOverlay />
          </Overlay>,

          <Overlay key="notifications" arrow rootClose
            style={ { width: 400, marginLeft: 4 }}
            show={ overlayName === 'notifications' }
            placement="bottom"
            container={ this }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }>
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
            target={ () => overlayTarget }>
              <HeaderProfileOverlay
                loggedUser={ loggedUser }
                onLogoutClick={ () => dispatch(logout()).then(() => history.push('/')) }
              />
          </Overlay>,

          <Dialog
            titleWithIcon="Create a new shout"
            key="newShout"
            open={ openNewShoutDialog }
            autoDetectWindowHeight
            autoScrollBodyContent
            bodyStyle={{ borderRadius: '5px' }}
            contentClassName="new-shout-popup"
            onRequestClose={ () => this.setState({ openNewShoutDialog: false }) }>
            {/* <HeaderNewShout
              flux={ flux }
              onShoutSent={ () => this.setState({ openNewShoutDialog: false }) }
              loggedUser={ loggedUser }
              currentLocation={ currentLocation }
            />*/}
          </Dialog>,

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
    currentLocation: currentLocation,
    loggedUser: session.user,
    unreadConversations,
  };
}

export default connect(mapStateToProps)(Header);
