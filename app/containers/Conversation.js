import React from "react";

import { ConnectToStores } from "../utils/FluxUtils";

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

const fetchData = (flux, params, query, done) => {
  flux.actions.loadMessages(params.id, done);
};

const mapStoresProps = (stores, params) => {
  const conversation = stores.conversations.get(params.id);

  if (!conversation || !conversation.didLoad || !conversation.didLoadMessages) {
    return {
      loading: conversation && conversation.loading
    };
  }

  const messages = stores.messages.getMessages(conversation.messageIds);
  return {
    conversation,
    messages,
    loading: false
  };
};

const listenToStores = ["conversations"];

export class Conversation extends React.Component {

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: []
  };

  componentDidMount() {
    this.subscribePresenceChannel();
  }

  shouldComponentUpdate(nextProps) {
    // Do not render all again if just draft changed
    if (nextProps.draft !== this.props.draft) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.params;
    const conversationChanged = prevProps.params.id !== id;

    if (conversationChanged) {
      fetchData(this.props.flux, this.props.params);
      this.unsubscribePresenceChannel();
      this.subscribePresenceChannel();
    }
  }

  componentWillUnmount() {
    this.unsubscribePresenceChannel();
  }

  presenceChannel: null;
  typingTimeouts: {};

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
  }

  unsubscribePresenceChannel() {
    if (this.presenceChannel) {
      unsubscribe(this.presenceChannel);
      this.presenceChannel = null;
    }
  }

  loadPreviousMessages() {
    const { conversation, messages } = this.props;
    if (!conversation.previous || conversation.loadingPrevious || messages.length === 0) {
      return;
    }
    const { id } = this.props.params;
    this.props.flux.actions.loadPreviousMessages(id, messages[0].created_at);
  }

  clearTypingTimeout(user) {
    clearTimeout(this.typingTimeouts[user.id]);
    delete this.typingTimeouts[user.id];
  }

  setTypingTimeout(user) {
    this.typingTimeouts[user.id] = setTimeout(() => {
      const index = this.state.typingUsers.findIndex(
        typingUser => typingUser.id === user.id
      );
      const typingUsers = [ ...this.state.typingUsers];
      typingUsers.splice(index, 1);
      this.setState({ typingUsers });
    }, 3000);
  }

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

  }

  render() {
    const { loggedUser, videoCallState, flux } = this.props;
    const { conversation, messages, draft, loading } = this.props;

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
          () => this.props.history.replaceState(null, "/messages") )
        }
        isDeleting={ conversation.isDeleting }
      />

      <UserShoutsSelectDialog
        buttonLabel="Send"
        user={ loggedUser }
        flux={ flux }
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

}

Conversation = ConnectToStores(Conversation, { fetchData, listenToStores, mapStoresProps });

export default Conversation;
