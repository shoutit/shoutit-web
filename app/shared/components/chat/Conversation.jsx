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

  mixins: [new FluxMixin(React), new StoreWatchMixin("conversations")],

  componentDidMount() {
    this.loadData();
    if (this.list) {
      this.setState({
        scrollTop: this.list.scrollTop,
        scrollHeight: this.list.scrollHeight
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      // Reset scroll state as the conversation change
      this.setState({
        scrollTop: undefined,
        scrollHeight: undefined
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.id !== this.props.params.id) {
      this.loadData();
    }

    if (this.shouldUpdateScrollPosition(prevState.messages, this.state.messages)) {
      const previousHeight = prevState.scrollHeight;
      const scrollHeight = this.list.scrollHeight;
      let scrollTop;
      if (!previousHeight) {
        // Scroll to bottom of the list
        scrollTop = scrollHeight;
      }
      else {
        // keep scrollTop the same, even if new messages have been added before
        scrollTop = scrollHeight - previousHeight + prevState.scrollTop;
      }
      this.list.scrollTop = scrollTop;
      this.setState({ scrollHeight, scrollTop });
    }

  },

  list: null,

  loadData() {
    const { id } = this.props.params;
    const conversation = this.getFlux().store("conversations").get(id);
    if (conversation && conversation.didLoad && conversation.didLoadMessages) {
      // Do not request data again if already loaded
      const messages = this.getFlux().store("messages").getMessages(conversation.messageIds);
      this.setState({...conversation, messages});
      return;
    }
    this.getFlux().actions.loadMessages(id);
  },

  shouldUpdateScrollPosition(previousMessages, currentMessages) {
    if ((previousMessages.length === 0 && currentMessages.length === 0) ||
      currentMessages.length === 0) {
      return false;
    }
    return (
      (previousMessages.length === 0 && currentMessages.length > 0) || // messages have been added
      (previousMessages[0].id !== currentMessages[0].id) // messages have been added before
    );
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

  handleListScroll(e) {
    const scrollTop = e.target.scrollTop;
    const { didLoad, previous, loadingPrevious, messages } = this.state;

    if (scrollTop < 10 && messages.length > 0 && didLoad && previous && !loadingPrevious) {
      this.getFlux().actions.loadPreviousMessages(this.props.params.id);
    }

    this.setState({ scrollTop });

  },

  render() {

    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, me, users, about, type }
      = this.state;

    const { conversationDraftChange, replyToConversation, loadPreviousMessages }
      = this.getFlux().actions;

    const hasMessages = messages.length > 0 ;

    return (
      <div className="Conversation">

        { didLoad && <MessagesTitle users={ users } about={ about } type={ type } me={ me } /> }

        { !hasMessages && loading && <p>Loading...</p> }

        { hasMessages &&
          <div className="Conversation-listContainer"
            ref={ ref => this.list = ref }
            onScroll={ this.handleListScroll }>
            <div className="Conversation-listTopSeparator" />
            { didLoad && previous && !loadingPrevious &&
              <div className="Conversation-paginationHandler" href="#" onClick={ () => loadPreviousMessages(id) }>
                Load older messages
              </div>
            }
            { previous && loadingPrevious &&
              <div className="Conversation-paginationHandler">
                Loading older messages...
              </div>
            }

            <MessagesList messages={ messages } me={ me } />

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
