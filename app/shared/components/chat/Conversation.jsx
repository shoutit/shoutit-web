import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import { History } from "react-router";
// import throttle from "lodash/function/throttle";

import ConversationTitle from "../chat/ConversationTitle.jsx";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog.jsx";
import MessagesList from "../chat/MessagesList.jsx";
import MessageReplyForm from "../chat/MessageReplyForm.jsx";
import Progress from "../helper/Progress.jsx";

import { subscribe, unsubscribe } from "../../../client/pusher";

if (process.env.BROWSER) {
  require("styles/components/Conversation.scss");
}

/**
 * Container component to display a conversation.
 */
export default React.createClass({

  displayName: "Conversation",

  mixins: [new FluxMixin(React), new StoreWatchMixin("conversations"), History],

  getInitialState() {
    return {
      showDeleteConversationDialog: false,
      typingUsers: []
    };
  },

  componentDidMount() {
    this.loadData();
    this.subscribePresenceChannel();
    if (this.list) {
      this.list.scrollTop = this.list.scrollHeight;
      this.setState({
        scrollTop: this.list.scrollHeight,
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
      this.unsubscribePresenceChannel();
      this.subscribePresenceChannel();
    }
    const { messages } = this.state;
    if (prevState.messages.length !== messages.length && this.list) {
      const addedBefore = prevState.messages.length > 0 && messages.length > 0
        && prevState.messages[0].id !== messages[0].id;

      const previousHeight = prevState.scrollHeight;
      const scrollHeight = this.list.scrollHeight;

      let scrollTop;
      if (!previousHeight || !addedBefore) {
        // Scroll to bottom of the list
        scrollTop = scrollHeight;
      }
      else {
        // keep scrollTop the same as before, even if new messages have been added
        scrollTop = scrollHeight - previousHeight + prevState.scrollTop;
      }
      this.list.scrollTop = scrollTop;
      this.setState({ scrollHeight, scrollTop });
    }

  },

  componentWillUnmount() {
    this.unsubscribePresenceChannel();
  },

  list: null,
  presenceChannel: null,

  getStateFromFlux() {
    const { id } = this.props.params;
    const conversationsStore = this.getFlux().store("conversations");
    const messagesStore = this.getFlux().store("messages");
    const userStore = this.getFlux().store("users");
    const conversation = conversationsStore.get(id);
    const loggedUser = userStore.getLoggedUser();

    const state = { messages: [], loading: true, loggedUser };

    if (conversation) {
      const { messageIds } = conversation;
      const draft = conversationsStore.getDraft(id);
      const messages = messageIds ? messagesStore.getMessages(messageIds) : [];
      return { ...state, ...conversation, messages, draft };
    }

    return state;
  },

  loadData() {
    const { id } = this.props.params;
    const flux = this.getFlux();
    const conversation = flux.store("conversations").get(id);
    if (conversation && conversation.didLoad && conversation.didLoadMessages) {
      const messages = flux.store("messages").getMessages(conversation.messageIds);
      this.setState({...conversation, messages});
    }
    this.getFlux().actions.loadMessages(id);
  },

  subscribePresenceChannel() {
    const { params, loggedUser } = this.props;
    this.presenceChannel = subscribe(
      `presence-c-${params.id}`, loggedUser, (err, channel) => {
        if (err) {
          console.error(err); // eslint-disable-line no-console
          return;
        }
        channel.bind("client-user_is_typing", user => this.handleUserIsTyping(user));
      }
    );
  },

  unsubscribePresenceChannel() {
    if (this.presenceChannel) {
      unsubscribe(this.presenceChannel);
      this.presenceChannel = null;
    }
  },

  handleListScroll(e) {
    const scrollTop = e.target.scrollTop;
    const { didLoad, previous, loadingPrevious, messages } = this.state;

    const shouldLoadPreviousMessages = scrollTop < 10 && messages.length > 0 &&
      didLoad && previous && !loadingPrevious;

    if (shouldLoadPreviousMessages) {
      const { id } = this.props.params;
      this.getFlux().actions.loadPreviousMessages(
        id,
        messages[0].created_at
      );
    }
    this.setState({ scrollTop });
  },

  handleUserIsTyping(user) {
    const { typingUsers } = this.state;
    const { loggedUser } = this.props;
    if (!typingUsers.find(typingUser => typingUser.id === user.id) &&
        (loggedUser.id !== user.id)) {
      this.setState({
        typingUsers: [...typingUsers, user]
      });
    }
  },

  handleTextChange(text) {
    const { params, loggedUser } = this.props;
    this.presenceChannel.trigger("client-user_is_typing", loggedUser);
    this.getFlux().actions.conversationDraftChange(params.id, text);
  },

  render() {

    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, loggedUser, users, about,
      type, error, showDeleteConversationDialog, isDeleting, typingUsers } = this.state;

    const { replyToConversation, deleteConversation } = this.getFlux().actions;

    return (
      <div className="Conversation">

      { didLoad &&
        <ConversationTitle
          onDeleteConversationTouchTap={ () => this.setState({showDeleteConversationDialog: true}) }
          onDeleteMessagesTouchTap={ () => {} }
          users={ users }
          about={ about }
          type={ type }
          me={ loggedUser && loggedUser.username }
        />
      }

      { error && !loading &&
        <div className="Conversation-error">
          { error.status && error.status === 404 ? "Page not found" : "Error loading this chat." }
        </div>
      }

      { didLoad && !messages.length > 0 && loading && <Progress centerVertical /> }

      { messages.length > 0 &&
        <div className="Conversation-listContainer"
          ref={ ref => this.list = ref }
          onScroll={ this.handleListScroll }>
          <div className="Conversation-listTopSeparator" />
          <div
            className="Conversation-progress"
            style={ loadingPrevious ? null : { visibility: "hidden" }}>
            <Progress />
          </div>
          <MessagesList
            typingUsers={ typingUsers }
            messages={ messages }
            me={ loggedUser && loggedUser.username }
          />
        </div>
      }

      { messages.length > 0 &&
        <div className="Conversation-replyFormContainer">
          <MessageReplyForm
            autoFocus
            placeholder="Add a reply"
            draft={ draft }
            onTextChange={ text => this.handleTextChange(text) }
            onSubmit={ () => replyToConversation(loggedUser, id, draft) }
          />
        </div>
      }

      <ConversationDeleteDialog
        open={ showDeleteConversationDialog }
        onCancel={ () => this.setState({showDeleteConversationDialog: false}) }
        onConfirm={() => deleteConversation(id, () => this.history.pushState(null, "/chat") )}
        isDeleting={ isDeleting }
      />

      </div>
    );
  }

});
