import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import {createSlug} from "./helper";
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
    new StoreWatchMixin("users", "chat", "conversations", "locations", "suggestions")
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
    const suggestions = flux.store('suggestions').getState();
    return { loggedUser, conversations, chat, currentLocation, suggestions };
  },

  getData() {
    const { flux } = this.props;
    const {currentLocation} = this.state;

    flux.actions.loadConversations();
    flux.actions.acquireLocation();
    flux.actions.getSuggestions(currentLocation);
  },

  render() {
    const { loggedUser, chat, conversations, currentLocation, suggestions } = this.state;
    const { children, flux, routes, location } = this.props;
    const suggestionsData = {
      loading: suggestions.loading,
      data: suggestions.data[createSlug(currentLocation.city)]
    };

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );
    const props = { loggedUser, chat, conversations, currentLocation, location, suggestions: suggestionsData };
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
