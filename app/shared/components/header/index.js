import React, { PropTypes } from "react";
import { Link} from "react-router";
import SearchBar from "./searchBar.jsx";
import ProfileDropdown from "./profileDropdown.jsx";
import Logo from "./logo.jsx";
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from "../helper";
import {Icon} from "../helper";

import MessagesButton from "../header/MessagesButton.jsx";

import NotifTopbarButton from "./notifications/notifTopbarButton.jsx";
import NewShoutButton from "../shouting/newShoutButton.jsx";

export default React.createClass({

  displayName: "Header",

  propTypes: {
    flux: PropTypes.object.isRequired,
    loggedUser: PropTypes.object,
    conversations: PropTypes.array,
    chat: PropTypes.object
  },

  mixins: [new StoreWatchMixin("locations")],

  componentDidMount() {
    this.props.flux.actions.acquireLocation();
  },

  getStateFromFlux() {
    const { flux } = this.props;
    return {
      locations: flux.store("locations").getState()
    };
  },

  render() {

    const { flux, loggedUser, chat, conversations } = this.props;
    const country = encodeURIComponent(this.state.locations.current);
    return (
      <header>
        <Grid className="si-header">
          <Column size="2" className="header-logo" clear>
            <Logo/>
          </Column>
          <Column className="header-search" size="6">
            <SearchBar height="36" flux={flux}/>
          </Column>
          <Column size="7" className="topbar-buttons">
            <div className="topbar-links">
              <Link to={`/home`}>Browse</Link>
              <Link to={`/discover/${country}`}>Discover</Link>
            </div>

            {/* Notification Icons */}
            <Icon name="home"/>
            <MessagesButton conversations={ conversations } chat={ chat } loggedUser={ loggedUser} />
            <NotifTopbarButton flux={flux} user={loggedUser} />

            <NewShoutButton flux={flux}/>

            {loggedUser ?
              <ProfileDropdown user={loggedUser}/> :
              <div style={{fontSize: "12px"}}>
                Not logged in
              </div>
            }
          </Column>
        </Grid>
      </header>
    );
  }
});
