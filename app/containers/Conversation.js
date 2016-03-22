import React from "react";
import { connect } from "react-redux";

import ConversationTitle from "../chat/ConversationTitle";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog";
import UserShoutsSelectDialog from "../users/UserShoutsSelectDialog";
import MessagesList from "../chat/MessagesList";
import MessageReplyForm from "../chat/MessageReplyForm";
import MessagesTypingUsers from "../chat/MessagesTypingUsers";
import Scrollable from "../ui/Scrollable";

import { loadMessages } from "../actions/chat";
import { denormalize } from "../schemas";

import Progress from "../shared/components/helper/Progress.jsx";
//
// let subscribe;
// let unsubscribe;
//
if (process.env.BROWSER) {
//   subscribe = require("../client/pusher").subscribe;
//   unsubscribe = require("../client/pusher").unsubscribe;
  require("./Conversation.scss");
}
//
// const mapStoresProps = (stores, params) => {
//   const conversation = stores.conversations.get(params.id);
//
//   if (!conversation || !conversation.didLoad || !conversation.didLoadMessages) {
//     return {
//       loading: conversation && conversation.loading
//     };
//   }
//
//   const messages = stores.messages.getMessages(conversation.messageIds);
//   return {
//     conversation,
//     messages,
//     loading: false
//   };
// };
//
// const listenToStores = ["conversations"];

export class Conversation extends React.Component {

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadMessages(this.props.conversationId));
    // this.subscribePresenceChannel();
  }

  shouldComponentUpdate(nextProps) {
    // Do not render all again if just draft changed
    if (nextProps.draft !== this.props.draft) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { conversationId, dispatch, messages } = this.props;
    if (prevProps.conversationId !== conversationId && !messages) {
      dispatch(loadMessages(conversationId));
      // this.unsubscribePresenceChannel();
      // this.subscribePresenceChannel();
    }
  }

  componentWillUnmount() {
    this.unsubscribePresenceChannel();
  }

  presenceChannel: null;
  typingTimeouts: {};

  subscribePresenceChannel() {
    // const { conversationId, loggedUser } = this.props;
    // this.presenceChannel = subscribe(
    //   `presence-c-${conversationId}`, loggedUser, (err, channel) => {
    //     if (err) {
    //       console.error(err); // eslint-disable-line no-console
    //       return;
    //     }
    //     channel.bind("client-user_is_typing", user => this.handleUserIsTyping(user));
    //   }
    // );
  }

  unsubscribePresenceChannel() {
    // if (this.presenceChannel) {
    //   unsubscribe(this.presenceChannel);
    //   this.presenceChannel = null;
    // }
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
    const { conversationError, messagesError } = this.props;
    const { loggedUser, isFetchingMessages, isFetchingConversations, conversation, messages=[], videoCallState, draft } = this.props;
    const { hasPreviousPage, dispatch, conversationId } = this.props;
    if (conversationError) {
      return (
        <div className="Conversation-error">
          { conversationError.message }
        </div>
      );
    }
    if (messagesError) {
      return (
        <div className="Conversation-error">
          { messagesError.message }
        </div>
      );
    }
    if (isFetchingConversations || !conversation) {
      return (
        <div className="Conversation">
          <Progress centerVertical />
        </div>
      );
    }

    const me = loggedUser ? loggedUser.username : undefined;
    //
    // const {
    //   replyToConversation,
    //   deleteConversation,
    //   conversationDraftChange,
    //   previewVideoCall
    // } = flux.actions;

    const { typingUsers, showAttachShout, showDelete } = this.state;

    return (
      <div className="Conversation">

        <ConversationTitle
          conversation={ conversation }
          me={ me }
          onDeleteConversationClick={ () => this.setState({ showDelete: true }) }
          onDeleteMessagesTouchTap={ () => {} }

        />
        {/*showVideoCallButton={ videoCallState.initialized }*/}

        {/*onVideoCallClick={ () =>
          previewVideoCall(conversation.users.find(user => user.username !== me))
        }*/}
{/*
      { conversation.error && !conversation.loading &&
        <div className="Conversation-error">
          { conversation.error.status && conversation.error.status === 404 ?
              "Page not found" :
              "Error loading this chat."
          }
        </div>
      }*/}

      { isFetchingMessages && messages.length === 0 && <Progress /> }

      { messages.length > 0 &&
        <Scrollable
          uniqueId={ messages[messages.length-1].id }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ hasPreviousPage ? () => dispatch(loadMessages(conversationId, "previous")) : null }
        >
          <div className="Conversation-messagesList">
            <div className="Conversation-listTopSeparator" />
            <div
              className="Conversation-progress"
              style={ isFetchingMessages ? null : { visibility: "hidden" }}>
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

{/*
        <div className="Conversation-replyFormContainer">
          <MessageReplyForm
            autoFocus
            initialValue={ conversation.draft }
            onTextChange={ text => conversationDraftChange(conversation.id, text) }
            onTyping={ () => this.presenceChannel.trigger("client-user_is_typing", loggedUser) }
            onAttachShoutClick={ () => this.setState({ showAttachShout: true }) }
            onSubmit={ text => replyToConversation(loggedUser, conversation.id, text) }
          />
        </div>*/}


      {/*<ConversationDeleteDialog
        open={ showDelete }
        onRequestClose={ () => this.setState({ showDelete: false }) }
        onConfirm={() => deleteConversation(conversation.id,
          () => this.props.history.replace("/messages") )
        }
        isDeleting={ conversation.isDeleting }
      />*/}
{/*
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
      />*/}

      </div>
    );
  }

}

function mapStateToProps(state, ownProps) {
  const { pagination, entities, session } = state;
  const id = ownProps.params.id;
  const isFetchingConversations = pagination.conversations.isFetching;

  let props = {
    isFetchingConversations,
    conversationId: id,
    loggedUser: session.user,
    isFetchingMessages: true,
    conversationError: pagination.conversations.error
  };

  const conversation = entities.conversations[id];
  if (!isFetchingConversations && conversation) {
    props = {
      ...props,
      conversation: denormalize(conversation, entities, "CONVERSATION")
    };
  }

  if (pagination.messages[id]) {
    const ids = pagination.messages[id].ids;
    props = {
      ...props,
      isFetchingMessages: pagination.messages[id].isFetching,
      page: pagination.messages[id].page,
      hasPreviousPage: pagination.messages[id].hasPreviousPage,
      messages: ids.map(id => denormalize(entities.messages[id], entities, "MESSAGE")),
      messagesError: pagination.messages[id].error
    };
  }

  return props;
}

export default connect(mapStateToProps)(Conversation);
