import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import MessagesTitle from "../chat/MessagesTitle.jsx";
import MessagesList from "../chat/MessagesList.jsx";
import MessageReplyForm from "../chat/MessageReplyForm.jsx";

/**
 * Container component to display a conversation.
 */
export default React.createClass({

  displayName: "Conversation",

  mixins: [new FluxMixin(React), new StoreWatchMixin("conversations", )],

  componentDidMount() {
    this.getFlux().actions.loadMessages(this.props.params.id);
    this.scrollListToBottom();
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.id !== this.props.params.id) {
      this.getFlux().actions.loadMessages(this.props.params.id);
    }
    if (
      (prevState.messages.length === 0 && this.state.messages.length > 0) ||
      (!prevState.didLoad && this.state.didLoad) ||
      (prevState.modified_at < this.state.modified_at)
    ) {
      this.scrollListToBottom();
    }
  },

  getStateFromFlux() {
    const { id } = this.props.params;
    const conversationsStore = this.getFlux().store("conversations");
    const messagesStore = this.getFlux().store("messages");
    const userStore = this.getFlux().store("users");

    const conversation = conversationsStore.get(id);
    const { username: me } = userStore.getLoggedUser();
    const state = {
      messages: [],
      loading: true,
      me
    };
    if (conversation && conversation.didLoad) {
      const { messageIds } = conversation;
      const draft = conversationsStore.getDraft(id);
      const messages = messageIds ? messagesStore.getMessages(messageIds) : [];
      return {
        ...state,
        ...conversation,
        messages,
        draft
      };
    }
    return state;
  },

  scrollListToBottom() {
    const { list } = this.refs;
    if (!list) {
      return;
    }
    list.scrollTop = list.scrollHeight;
  },

  render() {

    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, loadingNext, me, users, about, type, next,
      previous } = this.state;

    const { conversationDraftChange, replyToConversation, loadPreviousMessages,
      loadNextMessages } = this.getFlux().actions;

    const hasMessages = messages.length > 0 ;

    return (
      <div className="Conversation">

        { didLoad && <MessagesTitle users={ users } about={ about } type={ type } me={ me } /> }

        { !hasMessages && loading && <p>Loading...</p> }

        { hasMessages &&
          <div className="Conversation-listContainer" ref="list">
            <div className="Conversation-listTopSeparator" />
            { didLoad && previous && !loadingPrevious &&
              <a href="#" onClick={ () => loadPreviousMessages(id) }>
                Load older messages
              </a>
            }
            { previous && loadingPrevious &&
              <a href="#" onClick={ () => loadPreviousMessages(id) }>
                Loading older messages...
              </a>
            }
            <MessagesList messages={ messages } me={ me } />
            { didLoad && next && !loadingNext &&
              <a href="#" onClick={ () => loadNextMessages(id) }>
                Load next messages
              </a>
            }
            { next && loadingNext &&
              <a href="#" onClick={ () => loadNextMessages(id) }>
                Loading next messages...
              </a>
            }
          </div>
        }

        { hasMessages &&
          <div className="Conversation-replyFormContainer">
            <MessageReplyForm
              autoFocus
              draft={ draft }
              onTextChange={ text => conversationDraftChange(id, text) }
              onSubmit={ () => replyToConversation(id, draft) }
            />
          </div>
        }
      </div>
    );
  }

});
