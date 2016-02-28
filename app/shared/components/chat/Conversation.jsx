import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import { History } from "react-router";

import ConversationTitle from "../chat/ConversationTitle.jsx";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog.jsx";
import UserShoutsSelectDialog from "../user/UserShoutsSelectDialog.jsx";
import MessagesList from "../chat/MessagesList.jsx";
import MessageReplyForm from "../chat/MessageReplyForm.jsx";
import Progress from "../helper/Progress.jsx";

let subscribe, unsubscribe;

if (process.env.BROWSER) {
  subscribe = require("../../../client/pusher").subscribe;
  unsubscribe = require("../../../client/pusher").unsubscribe;
  require("styles/components/Conversation.scss");
}

/**
 * Container component to display a conversation.
 */
export default React.createClass({

  displayName: "Conversation",

  mixins: [
    new FluxMixin(React),
    new StoreWatchMixin("conversations"),
    History
  ],

  getInitialState() {
    return {
      showDelete: false,
      showAttachShout: false
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
  typingTimeouts: {},

  getStateFromFlux() {
    const { id } = this.props.params;
    const conversationsStore = this.getFlux().store("conversations");
    const messagesStore = this.getFlux().store("messages");
    const conversation = conversationsStore.get(id);

    const state = { messages: [], loading: true, typingUsers: [] };

    if (conversation) {
      const { messageIds } = conversation;
      const draft = conversationsStore.getDraft(id);
      const messages = messageIds ? messagesStore.getMessages(messageIds) : [];

      // Remove typing user if last message is the same
      const typingUsers = this.state ? [ ...this.state.typingUsers] : [];
      const typingUserIndex = typingUsers.findIndex(
        user => user.id === conversation.last_message.user.id
      );
      if (typingUserIndex > -1) {
        typingUsers.splice(typingUserIndex, 1);
      }
      return { ...state, ...conversation, typingUsers, messages, draft };
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

  clearTypingTimeout(user) {
    clearTimeout(this.typingTimeouts[user.id]);
    delete this.typingTimeouts[user.id];
  },

  setTypingTimeout(user) {
    this.typingTimeouts[user.id] = setTimeout(() => {
      const index = this.state.typingUsers.findIndex(
        typingUser => typingUser.id === user.id
      );
      const typingUsers = [ ...this.state.typingUsers];
      typingUsers.splice(index, 1);
      this.setState({ typingUsers });
    }, 3000);
  },

  handleUserIsTyping(user) {
    const { typingUsers } = this.state;
    const { loggedUser } = this.props;

    const isAlreadyTyping = typingUsers.find(typingUser => typingUser.id === user.id);

    if (loggedUser.id === user.id) {
      return;
    }

    if (isAlreadyTyping) {
      this.clearTypingTimeout(user);
      this.setTypingTimeout(user);
    }
    else {
      this.setState({
        typingUsers: [...this.state.typingUsers, user]
      }, () => this.setTypingTimeout(user));
    }

  },

  render() {
    const { loggedUser, videoCallState } = this.props;
    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, users,
      about, type, error, showDelete, isDeleting, typingUsers, showAttachShout } = this.state;

    const { replyToConversation, deleteConversation, conversationDraftChange, inviteToVideoCall }
      = this.getFlux().actions;

    return (
      <div className="Conversation">

      { didLoad &&
        <ConversationTitle
          users={ users }
          about={ about }
          type={ type }
          me={ loggedUser && loggedUser.username }
          videoCallState={ videoCallState }
          onDeleteConversationClick={ () => this.setState({ showDelete: true }) }
          onDeleteMessagesTouchTap={ () => {} }
          onVideoCallClick={ () => inviteToVideoCall(users.find(user => user.username !== loggedUser.username)) }
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
            onTextChange={ text => conversationDraftChange(id, text) }
            onTyping={ () =>
              this.presenceChannel.trigger("client-user_is_typing", loggedUser)
            }
            onAttachShoutClick={ () => this.setState({showAttachShout: true}) }
            onSubmit={ () => replyToConversation(loggedUser, id, draft) }
          />
        </div>
      }

      <ConversationDeleteDialog
        open={ showDelete }
        onRequestClose={ () => this.setState({ showDelete: false }) }
        onConfirm={() => deleteConversation(id,
          () => this.history.replaceState(null, "/messages") )
        }
        isDeleting={ isDeleting }
      />

      <UserShoutsSelectDialog
        buttonLabel="Send"
        user={ loggedUser }
        flux={ this.getFlux() }
        open={ showAttachShout }
        onRequestClose={ () => this.setState({ showAttachShout: false }) }
        onSelectionConfirm={ shouts => {
          const attachments = shouts.map(shout => ({ shout }));
          replyToConversation(loggedUser, id, draft, attachments);
          this.setState({ showAttachShout: false });
        }}
      />

      </div>
    );
  }

});
