import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import {createSlug} from "./helper";
import Header from "./header";
import MainPage from "./main/mainPage.jsx";
import NotificationSystem from "react-notification-system";

const pagesWithoutHeader = [ MainPage ];

if (process.env.BROWSER) {
  require("styles/components/App.scss");
}

export default React.createClass({

  displayName: "App",

  propTypes: {
    flux: PropTypes.object.isRequired
  },

  mixins: [
    new FluxMixin(React),
    new StoreWatchMixin("users", "chat", "conversations", "locations", "suggestions")
  ],

  displayUINotif(message, type = "success") {
    this._UINotif.addNotification({
      message: message,
      level: type,
      position: 'tr', // top right
      autoDismiss: 4
    });
  },

  componentDidMount() {
    this.getData();
    this._UINotif = this.refs.UINotifSystem;
  },

  componentDidUpdate(prevProps, prevState) {
    const { loggedUser, currentLocation } = this.state;
    if (prevState.loggedUser !== loggedUser) {
      this.getData();
    }
    // Actions triggered in location change
    if (prevState.currentLocation.city !== currentLocation.city) {
      this.props.flux.actions.getSuggestions(currentLocation);
    }
  },

  getStateFromFlux() {
    const { flux } = this.props;
    const loggedUser = flux.store("users").getLoggedUser();
    const chat = flux.store("chat").getState();
    const conversations = flux.store("conversations").getConversations(chat.conversationIds);
    const currentLocation = flux.store("locations").getCurrent();
    const suggestions = flux.store("suggestions").getState();
    return { loggedUser, conversations, chat, currentLocation, suggestions };
  },

  getData() {
    const { flux } = this.props;
    const {currentLocation, loggedUser} = this.state;

    flux.actions.acquireLocation();
    loggedUser && flux.actions.loadConversations();
    currentLocation.city && flux.actions.getSuggestions(currentLocation);
  },

  render() {
    const { loggedUser, chat, conversations, currentLocation, suggestions } = this.state;
    const { children, flux, routes, location, history } = this.props;
    const { displayUINotif } = this;

    const suggestionsData = {
      data: suggestions.data[createSlug(currentLocation.city)]
    };

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );
    const props = { loggedUser, chat, conversations, currentLocation, location,
      suggestions: suggestionsData, history, displayUINotif };

    return (
      <div className={`App${hideHeader ? "" : " stickyHeader"}` }>
        { !hideHeader &&
          <div className="App-header">
            <Header
              history={ history }
              loggedUser={ loggedUser }
              currentLocation={ currentLocation }
              flux={ flux }
              chat={ chat }
              conversations={ conversations }
              location={ location }
            />
          </div>
        }
        <div className="App-content">
          { React.cloneElement(children, props) }
        </div>
        <NotificationSystem ref="UINotifSystem" />
      </div>
    );
  }
});
