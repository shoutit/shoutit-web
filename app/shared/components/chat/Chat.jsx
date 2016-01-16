import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import Page from "../helper/Page.jsx";
import ConversationsList from "../chat/ConversationsList.jsx";

/**
 * Container component to display the chat.
 */
export default React.createClass({

  displayName: "Chat",

  mixins: [new FluxMixin(React), new StoreWatchMixin("chat", "users")],

  componentDidMount() {
    this.getFlux().actions.loadConversations();
  },

  getStateFromFlux() {
    const { conversationIds, loading, next, previous } = this.getFlux().store("chat").getState();
    const conversations = this.getFlux().store("conversations").getConversations(conversationIds);
    const { username: me } = this.getFlux().store("users").getLoggedUser();
    return { conversations, loading, me, next, previous };
  },

  render() {
    const { conversations, me, loading, next, previous } = this.state;
    const { flux, params, children } = this.props;

    const { loadPreviousConversations, loadNextConversations } = this.getFlux().actions;

    return (
      <Page fixedHeight title="Chats – Shoutit" flux={ flux } rightContent={ <p>Right board</p> }>
        <div className="Chat">

          <div className="Chat-conversations">
            { previous &&
              <a href="#" onClick={ () => loadPreviousConversations() }>
                Load older conversations
              </a>
            }
            <ConversationsList
              loading={ loading }
              conversations={ conversations }
              selectedId={ params.id }
              me={ me }
            />
            { next &&
              <a href="#" onClick={ () => loadNextConversations() }>
                Load more conversations
              </a>
            }
          </div>

          <div className="ChatContainer-messages">

            { children && React.cloneElement(children, { flux }) }
            { !children &&
              <p>
                { loading ?
                    "Loading..." :
                  conversations.length > 0 ?
                    "Pick a message " :
                    "No message!"
                }
              </p>}
          </div>

        </div>
      </Page>
    );
  }

});
