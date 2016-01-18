import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import Page from "../helper/Page.jsx";
import Progress from "../helper/Progress.jsx";

import ConversationsTitle from "../chat/ConversationsTitle.jsx";
import ConversationItem from "../chat/ConversationItem.jsx";

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
    const { conversations, me, loading, previous } = this.state;
    const { flux, params, children } = this.props;
    const unread = conversations.filter(c => c.unread_messages_count > 0);

    const { loadPreviousConversations } = this.getFlux().actions;

    return (
      <Page fixedHeight title="Chats – Shoutit" flux={ flux } rightContent={ <p>Right board</p> }>
        <div className="Chat">

          <div className="Chat-conversations">

          <ConversationsTitle unreadCount={ unread.length } />
            { previous &&
              <a href="#" onClick={ () => loadPreviousConversations() }>
                Load older conversations
              </a>
            }

            { conversations.length > 0 &&
              <ul className="ConversationsList">
                { conversations.map(conversation =>
                  <li key={ conversation.id }>
                    <ConversationItem
                      { ...conversation }
                      me={ me }
                      selected={ conversation.id === params.id }
                    />
                  </li>
                )}
              </ul>
            }

            { loading && <div style={ {align: "center" }}><Progress /></div> }

          </div>

          <div className="Chat-messages">

            { children && React.cloneElement(children, { flux }) }
            { !children &&
              <div className="Chat-placeholder">
                { loading && conversations.length === 0 ?
                    <div style={{ align: "center" }}>
                      <Progress />
                    </div> :
                  conversations.length > 0 ?
                    "Pick a message " :
                    "No message!"
                }
              </div>}
          </div>

        </div>
      </Page>
    );
  }

});
