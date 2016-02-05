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

  mixins: [new FluxMixin(React), new StoreWatchMixin("users", "chat")],

  componentDidMount() {
    this.props.flux.actions.loadConversations();
  },

  getStateFromFlux() {
    const loggedUser = this.props.flux.store("users").getLoggedUser();
    const chat = this.props.flux.store("chat").getState();
    const conversations = this.props.flux.store("conversations").getConversations(chat.conversationIds);
    return { loggedUser, conversations, chat  };
  },

  render() {
    const { loggedUser, chat, conversations } = this.state;
    const { children, flux, routes } = this.props;

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );

    return (
      <div>
        { !hideHeader &&
          <Header loggedUser={ loggedUser }
            flux={ flux }
            chat={ chat }
            conversations={ conversations }
          />
        }
        { React.cloneElement(children, { loggedUser, chat, conversations }) }
      </div>
    );
  }
});
