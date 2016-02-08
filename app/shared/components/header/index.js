import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Overlay from "../helper/Overlay";

import SearchBar from "./searchBar.jsx";

import HeaderMessagesOverlay from "../header/HeaderMessagesOverlay.jsx";
import HeaderProfileOverlay from "../header/HeaderProfileOverlay.jsx";
import HeaderProfile from "../header/HeaderProfile.jsx";
import HeaderLoggedOut from "../header/HeaderLoggedOut.jsx";

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
    if (nextProps.location.key !== this.props.location.key) {
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

  render() {
    const { flux, loggedUser, conversations, chat, currentLocation } = this.props;

    const { overlayName, overlayTarget } = this.state;

    const unreadConversations = conversations ?
      conversations.filter(c => c.unread_messages_count > 0).length : 0;

    return (
      <header className="si-container Header">

        <div className="Header-logo">
          <Link to="/">
            <img height="36" src={ `${imagesPath}/logo.png` } />
          </Link>
        </div>

        <div className="Header-search">
          <SearchBar height="36" flux={flux}/>
        </div>

        <div className="Header-links">
          <Link to="/home">
            Browse
          </Link>
          <Link to={`/discover/${encodeURIComponent(currentLocation)}`}>
            Discover
          </Link>
        </div>

        { loggedUser ?
          <HeaderProfile
            onMessagesClick={  e => this.showOverlay(e, "messages")  }
            onProfileClick={ e => this.showOverlay(e, "profile") }
            onNotificationsClick={ e => this.showOverlay(e, "notifications") }
            flux={ flux }
            loggedUser={ loggedUser }
            unreadConversations={ unreadConversations }
          /> :
          <HeaderLoggedOut />
        }

        <Overlay arrow rootClose
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
              unreadConversations={ 10 }
              onMarkAsReadClick={ () => {} }
            />
        </Overlay>

        <Overlay arrow rootClose
          style={ { width: 400, marginLeft: 4  }}
          show={ overlayName === "notifications" }
          placement="bottom"
          container={ this }
          onHide={ () => this.hideOverlay() }
          target={ () => overlayTarget }>
            <p>Notifications</p>
        </Overlay>

        <Overlay rootClose arrow inverted
          style={ { width: 200, marginLeft: 10 }}
          show={ overlayName === "profile" } placement="bottom" container={ this }
          onHide={ () => this.hideOverlay() }
          target={ () => overlayTarget }>
            <HeaderProfileOverlay loggedUser={ loggedUser } onLogoutClick={ () => flux.actions.logout() } />
        </Overlay>

      </header>
    );
  }
}
