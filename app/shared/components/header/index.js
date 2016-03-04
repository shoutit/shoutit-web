import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import Dialog from "../helper/Dialog";
import Overlay from "../helper/Overlay";
import Button from "../helper/Button.jsx";
import SearchBar from "./searchBar.jsx";

import HeaderMessagesOverlay from "../header/HeaderMessagesOverlay.jsx";
import HeaderNotificationsOverlay from "../header/HeaderNotificationsOverlay.jsx";
import HeaderProfileOverlay from "../header/HeaderProfileOverlay.jsx";
import HeaderProfile from "../header/HeaderProfile.jsx";
import HeaderNewShout from "../header/HeaderNewShout.jsx";

import { imagesPath } from "../../../../config";

if (process.env.BROWSER) {
  require("styles/components/header.scss");
}

export default class Header extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    loggedUser: PropTypes.object,
    location: PropTypes.object,
    conversations: PropTypes.array,
    chat: PropTypes.object,
    currentLocation: PropTypes.object
  };

  state = {
    overlayName: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location && nextProps.location.key !== this.props.location.key) {
      this.hideOverlay();
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
        encodeURIComponent(currentLocation.country) : undefined
    };
    history.pushState(null, "/search/all/all", query);
    flux.actions.searchShouts({
      category: "all", shouttype: "all", ...query
    });
  }

  render() {
    const { flux, loggedUser, conversations, chat, currentLocation, location, history, onSearchChange } = this.props;
    const { country } = currentLocation;
    const { overlayName, overlayTarget, openNewShoutDialog } = this.state;
    const unreadConversations = conversations ?
      conversations.filter(c => c.unread_messages_count > 0) : [];
    return (
      <header className="Header">
        <div className="Header-logo">
          <Link to="/">
            <img height="36" width="132" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-search">
          <SearchBar
            height="36"
            flux={ flux }
            history={ history }
            onSearchChange={ (keyword) => onSearchChange(keyword) }/>
        </div>

        <div className="Header-links">
          <span className="Header-separator" />
          <Button onClick={ e => this.handleBrowseClick(e) } label="Browse" />
          <Button to={ "/discover" + (country ? ("/" + country.toLowerCase()) : "") } label="Discover" />
          { loggedUser && <span className="Header-separator" /> }
        </div>

        { loggedUser ?
          <div className="Header-tools loggedIn">
            <HeaderProfile
              onMessagesClick={  e => this.showOverlay(e, "messages")  }
              onProfileClick={ e => this.showOverlay(e, "profile") }
              onNotificationsClick={ e => this.showOverlay(e, "notifications") }
              onNewShoutClick={ () => this.setState({ openNewShoutDialog: true }) }
              loggedUser={ loggedUser }
              unreadCount={ unreadConversations.length }
            />
          </div> :
          <div className="Header-tools loggedOut">
            <Button
              label="Log in"
              to="/login"
              onClick={ e => {
                e.preventDefault();
                history.pushState({ modal: "login" }, location.pathname);
              }}
            />
            <Button
              label="Sign up"
              primary
              to="/signup"
              onClick={ e => {
                e.preventDefault();
                history.pushState({ modal: "signup" }, location.pathname);
              }}
            />
          </div>
        }

        { process.env.BROWSER && loggedUser && [

          <Overlay key="messages" arrow rootClose
            style={ { width: 400, marginLeft: 4  }}
            show={ overlayName === "messages" }
            placement="bottom"
            container={ this }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }>
              <HeaderMessagesOverlay
                loggedUser={ loggedUser }
                chat={ chat }
                conversations={ conversations }
                unreadCount={ unreadConversations.length }
                onMarkAsReadClick={ () => {
                  unreadConversations.forEach(c => flux.actions.markConversationAsRead(c.id));
                }}
              />
          </Overlay>,

          <Overlay key="notifications" arrow rootClose
            style={ { width: 400, marginLeft: 4  }}
            show={ overlayName === "notifications" }
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
            show={ overlayName === "profile" }
            onHide={ () => this.hideOverlay() }
            target={ () => overlayTarget }>
              <HeaderProfileOverlay
                loggedUser={ loggedUser }
                onLogoutClick={ () => flux.actions.logout() }
              />
          </Overlay>,

          <Dialog
            titleWithIcon="Create a new shout"
            key="newShout"
            open={ openNewShoutDialog }
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            bodyStyle={{ borderRadius: "5px"}}
            contentClassName="new-shout-popup"
            onRequestClose={ () => this.setState({ openNewShoutDialog: false }) }>
            <HeaderNewShout
              flux={ flux }
              onShoutSent={ () => this.setState({ openNewShoutDialog: false }) }
              loggedUser={ loggedUser }
              currentLocation={ currentLocation }
            />
          </Dialog>

        ]}

      </header>
    );
  }
}
