import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import DocumentTitle from "react-document-title";

import FixedHeightPage from "../helper/FixedHeightPage.jsx";

import Progress from "../helper/Progress.jsx";

import ConversationsTitle from "../chat/ConversationsTitle.jsx";
import ConversationItem from "../chat/ConversationItem.jsx";

if (process.env.BROWSER) {
  require("styles/components/Chat.scss");
}

/**
 * Container component to display the chat.
 */
export default React.createClass({

  displayName: "Chat",

  propTypes: {
    loggedUser: PropTypes.object.isRequired
  },

  mixins: [new FluxMixin(React), new StoreWatchMixin("chat", "conversations")],

  componentDidMount() {
    this.getFlux().actions.loadConversations();
  },

  getStateFromFlux() {
    const { conversationIds, loading, next, previous } = this.getFlux().store("chat").getState();
    const conversations = this.getFlux().store("conversations").getConversations(conversationIds);
    return { conversations, loading, next, previous };
  },

  render() {
    const { conversations, loading, previous } = this.state;
    const { flux, params, children, loggedUser } = this.props;
    const unread = conversations.filter(c => c.unread_messages_count > 0);

    const { loadPreviousConversations } = this.getFlux().actions;

    return (
      <DocumentTitle title="Messages - Shoutit">
        <FixedHeightPage>
          <div className="Chat">

            <div className="Chat-conversations">

            <ConversationsTitle unreadCount={ unread.length } />
              { previous &&
                <a href="#" onClick={ () => loadPreviousConversations() }>
                  Load older conversations
                </a>
              }

              { conversations.length > 0 &&
                <ul className="Chat-conversationsList">
                  { conversations.map(conversation =>
                    <li key={ conversation.id }>
                      <ConversationItem
                        { ...conversation }
                        me={ loggedUser && loggedUser.username }
                        unread = { conversation.unread_messages_count > 0 }
                        selected={ conversation.id === params.id }
                      />
                    </li>
                  )}
                </ul>
              }

              { loading && <Progress /> }

            </div>

            <div className="Chat-messages">

              { children && React.cloneElement(children, { flux, loggedUser }) }
              { !children &&
                <div className="Chat-placeholder">
                  { loading && conversations.length === 0 ?
                    <Progress centerVertical /> :
                    conversations.length > 0 ?
                      "Please pick a conversation." :
                      "No messages, yet!"
                  }
                </div>}
            </div>

          </div>
        </FixedHeightPage>
      </DocumentTitle>
    );
  }

});
