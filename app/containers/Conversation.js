import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import { History } from "react-router";

import ConversationTitle from "../chat/ConversationTitle";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog";
import UserShoutsSelectDialog from "../users/UserShoutsSelectDialog";
import MessagesList from "../chat/MessagesList";
import MessageReplyForm from "../chat/MessageReplyForm";
import MessagesTypingUsers from "../chat/MessagesTypingUsers";
import Scrollable from "../ui/Scrollable";

import Progress from "../shared/components/helper/Progress.jsx";

let subscribe;
let unsubscribe;

if (process.env.BROWSER) {
  subscribe = require("../client/pusher").subscribe;
  unsubscribe = require("../client/pusher").unsubscribe;
  require("./Conversation.scss");
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
  },

  shouldComponentUpdate(nextProps, nextState) {
    // Do not render all again if just draft changed
    if (nextState.draft !== this.state.draft) {
      return false;
    }
    return true;
  },

  componentDidUpdate(prevProps) {
    const { id } = this.props.params;
    const conversationChanged = prevProps.params.id !== id;

    if (conversationChanged) {
      if (this.props.flux.stores.conversations.didLoadMessages(id)) {
        // Reuse existing data
        this.setState(this.getStateFromFlux());
        return;
      }
      // Load data
      this.loadData();
      this.unsubscribePresenceChannel();
      this.subscribePresenceChannel();
    }

  },

  componentWillUnmount() {
    this.unsubscribePresenceChannel();
  },

  presenceChannel: null,
  typingTimeouts: {},

  getStateFromFlux() {

    const { id } = this.props.params;
    const { flux } = this.props;
    const conversation = flux.store("conversations").get(id);

    if (!conversation || !conversation.didLoad || !conversation.didLoadMessages) {
      return {
        loading: conversation && conversation.loading
      };
    }

    const messages = flux.store("messages").getMessages(conversation.messageIds);

    // Remove typing user if last message is the same
    const typingUsers = this.state.typingUsers || [];
    const typingUserIndex = typingUsers.findIndex(
      user => user.id === conversation.last_message.user.id
    );
    if (typingUserIndex > -1) {
      typingUsers.splice(typingUserIndex, 1);
    }

    return { conversation, messages, typingUsers, loading: false };

  },

  loadData() {
    const { id } = this.props.params;
    this.props.flux.actions.loadMessages(id);
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

  loadPreviousMessages() {
    const { conversation, messages } = this.state;
    if (!conversation.previous || conversation.loadingPrevious || messages.length === 0) {
      return;
    }
    const { id } = this.props.params;
    this.props.flux.actions.loadPreviousMessages(id, messages[0].created_at);
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
    } else {
      this.setState({
        typingUsers: [...this.state.typingUsers, user]
      }, () => this.setTypingTimeout(user));
    }

  },

  render() {
    const { loggedUser, videoCallState, flux } = this.props;
    const { conversation, messages, draft, loading } = this.state;

    if (!conversation || loading) {
      return <div className="Conversation">
        { loading && <Progress centerVertical /> }
      </div>;
    }

    const me = loggedUser ? loggedUser.username : undefined;

    const {
      replyToConversation,
      deleteConversation,
      conversationDraftChange,
      previewVideoCall
    } = flux.actions;


    const { typingUsers, showAttachShout, showDelete } = this.state;

    return (
      <div className="Conversation">

      { conversation.didLoad &&
        <ConversationTitle
          conversation={ conversation }
          me={ me }
          showVideoCallButton={ videoCallState.initialized }
          onDeleteConversationClick={ () => this.setState({ showDelete: true }) }
          onDeleteMessagesTouchTap={ () => {} }
          onVideoCallClick={ () =>
            previewVideoCall(conversation.users.find(user => user.username !== me))
          }
        />
      }

      { conversation.error && !conversation.loading &&
        <div className="Conversation-error">
          { conversation.error.status && conversation.error.status === 404 ?
              "Page not found" :
              "Error loading this chat."
          }
        </div>
      }

      { conversation.loading &&
        <Progress centerVertical />
      }

      { conversation.didLoadMessages &&

        <Scrollable
          uniqueId={ messages[messages.length-1].id }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ e => this.loadPreviousMessages(e) }
        >
          <div className="Conversation-messagesList">
            <div className="Conversation-listTopSeparator" />
            <div
              className="Conversation-progress"
              style={ conversation.loadingPrevious ? null : { visibility: "hidden" }}>
              <Progress />
            </div>

            <MessagesList
              loggedUser={ loggedUser }
              messages={ messages }
              partecipants={ conversation.users }
            />

            <MessagesTypingUsers users={ typingUsers } />

          </div>

        </Scrollable>
      }

      { conversation.didLoadMessages &&
        <div className="Conversation-replyFormContainer">
          <MessageReplyForm
            autoFocus
            initialValue={ conversation.draft }
            onTextChange={ text => conversationDraftChange(conversation.id, text) }
            onTyping={ () => this.presenceChannel.trigger("client-user_is_typing", loggedUser) }
            onAttachShoutClick={ () => this.setState({ showAttachShout: true }) }
            onSubmit={ text => replyToConversation(loggedUser, conversation.id, text) }
          />
        </div>
      }

      <ConversationDeleteDialog
        open={ showDelete }
        onRequestClose={ () => this.setState({ showDelete: false }) }
        onConfirm={() => deleteConversation(conversation.id,
          () => this.history.replaceState(null, "/messages") )
        }
        isDeleting={ conversation.isDeleting }
      />

      <UserShoutsSelectDialog
        buttonLabel="Send"
        user={ loggedUser }
        flux={ this.getFlux() }
        open={ showAttachShout }
        onRequestClose={ () => this.setState({ showAttachShout: false }) }
        onSelectionConfirm={ shouts => {
          const attachments = shouts.map(shout => ({ shout }));
          replyToConversation(loggedUser, conversation.id, draft, attachments);
          this.setState({ showAttachShout: false });
        }}
      />

      </div>
    );
  }

});
