import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import {createSlug} from "./helper";
import Header from "./header";
import MainPage from "./main/mainPage.jsx";
import NotificationHost from "./notifications/NotificationHost.jsx";
import VideoCallHost from "./helper/VideoCallHost";

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
    new StoreWatchMixin(
      "auth",
      "chat",
      "conversations",
      "locations",
      "suggestions",
      "ui_notifications",
      "videocall"
    )
  ],

  getInitialState() {
    return {
      searchKeyword: ""
    };
  },

  componentDidMount() {
    this.getData();
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
    const chat = flux.store("chat").getState();
    const conversations = flux.store("conversations").getConversations(chat.conversationIds);
    const currentLocation = flux.store("locations").getCurrent();
    const loggedUser = flux.store("auth").getLoggedProfile();
    const suggestions = flux.store("suggestions").getState();
    const uiNotifications = flux.store("ui_notifications").getNotifications();
    const videoCallState = flux.store("videocall").getState();
    return {
      chat,
      conversations,
      currentLocation,
      loggedUser,
      suggestions,
      videoCallState,
      uiNotifications
    };
  },

  getData() {
    const { flux } = this.props;
    const { loggedUser } = this.state;

    flux.actions.acquireLocation();

    if (loggedUser) {
      flux.actions.loadConversations();
      if (require("webrtcsupport").support) {
        flux.actions.initTwilio();
      }
    }
  },

  render() {
    const { loggedUser, chat, conversations, currentLocation, suggestions, videoCallState, searchKeyword } = this.state;
    const { children, flux, routes, location, history } = this.props;

    const onSearchChange = (keyword) => this.setState({ searchKeyword: keyword });

    const suggestionsData = {
      data: suggestions.data[createSlug(currentLocation.city)]
    };

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );
    const props = { loggedUser, chat, conversations, currentLocation, location,
      suggestions: suggestionsData, onSearchChange, history, videoCallState };

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
              onSearchChange={ onSearchChange }
            />
          </div>
        }
        <div className="App-content">
          { React.cloneElement(children, { ...props, searchKeyword }) }
        </div>
        <NotificationHost
          notifications={ this.state.uiNotifications }
          flux={ flux }
        />
        { videoCallState.currentConversation &&
          <VideoCallHost conversation={ videoCallState.currentConversation } /> }
      </div>
    );
  }
});
