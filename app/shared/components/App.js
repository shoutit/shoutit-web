import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import Header from "./header";
import MainPage from "./main/mainPage.jsx";

const pagesWithoutHeader = [ MainPage ];

export default React.createClass({

  displayName: "App",

  propTypes: {
    flux: PropTypes.object.isRequired
  },

  mixins: [
    new FluxMixin(React),
    new StoreWatchMixin("users", "chat", "conversations", "locations")
  ],

  componentDidMount() {
    this.getData();
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loggedUser !== this.state.loggedUser) {
      this.getData();
    }
  },

  getStateFromFlux() {
    const { flux } = this.props;
    const loggedUser = flux.store("users").getLoggedUser();
    const chat = flux.store("chat").getState();
    const conversations = flux.store("conversations").getConversations(chat.conversationIds);
    const currentLocation = flux.store("locations").getState().current;
    return { loggedUser, conversations, chat, currentLocation  };
  },

  getData() {
    const { flux } = this.props;
    flux.actions.loadConversations();
    flux.actions.acquireLocation();
  },

  render() {
    const { loggedUser, chat, conversations, currentLocation } = this.state;
    const { children, flux, routes, location } = this.props;

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );
    const props = { loggedUser, chat, conversations, currentLocation, location };
    return (
      <div>
        { !hideHeader &&
          <Header
            loggedUser={ loggedUser }
            currentLocation={ currentLocation }
            flux={ flux }
            chat={ chat }
            conversations={ conversations }
            location={ location }
          />
        }
        { React.cloneElement(children, props) }
      </div>
    );
  }
});
