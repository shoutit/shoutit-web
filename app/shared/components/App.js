import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import {createSlug} from "./helper";
import Header from "./header";
import MainPage from "./main/mainPage.jsx";
import NotificationHost from "./helper/NotificationHost.jsx";

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
    new StoreWatchMixin("users", "chat", "conversations", "locations", "suggestions", "ui_notifications")
  ],

  /**
   * Show UI Notification when a user/tag listening event is triggered
   *
   * @param {OBJECT.<isListening, name>} ev - The event returned from buttons
   */
  onListeningChange({ isListening, name }) {
    if(isListening) {
      this._UINotif.addNotification({
        message: `You are listening to ${name}`,
        level: "success",
        position: 'tr', // top right
        autoDismiss: 4
      });
    } else {
      this._UINotif.addNotification({
        message: `You are no longer listening to ${name}`,
        level: "warning",
        position: 'tr', // top right
        autoDismiss: 4
      });
    }
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
    const uiNotifications = flux.store("ui_notifications").getNotifications();
    return { loggedUser, conversations, chat, currentLocation, suggestions, uiNotifications };
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
    const { onListeningChange } = this;

    const suggestionsData = {
      data: suggestions.data[createSlug(currentLocation.city)]
    };

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );
    const props = { loggedUser, chat, conversations, currentLocation, location,
      suggestions: suggestionsData, history, onListeningChange };

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
        <NotificationHost
          notifications={ this.state.notifications }
        />
      </div>
    );
  }
});
