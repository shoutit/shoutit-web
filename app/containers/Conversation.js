import React from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import ConversationTitle from "../chat/ConversationTitle";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog";
import UserShoutsSelectDialog from "../users/UserShoutsSelectDialog";
import MessagesList from "../chat/MessagesList";
import ConversationReplyForm from "../chat/ConversationReplyForm";
import MessagesTypingUsers from "../chat/MessagesTypingUsers";
import Scrollable from "../ui/Scrollable";

import { loadMessages, deleteConversation } from "../actions/chat";
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
    const { conversationId, dispatch } = this.props;
    if (prevProps.conversationId !== conversationId) {
      dispatch(loadMessages(conversationId));
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

    const { error, messagesError } = this.props;
    const { loggedUser, isFetchingMessages, isFetching, conversation, messages=[], videoCallState, draft } = this.props;

    const { previousUrl, dispatch, conversationId } = this.props;
    if (error) {
      return (
        <div className="Conversation-error">
          { error.message }
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
    if (isFetching || !conversation) {
      return (
        <div className="Conversation">
          <Progress centerVertical />
        </div>
      );
    }

    const me = loggedUser ? loggedUser.username : undefined;

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

      { isFetchingMessages && messages.length === 0 && <Progress /> }

      { messages.length > 0 &&
        <Scrollable
          uniqueId={ messages[messages.length-1].id }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ previousUrl ? () => dispatch(loadMessages(conversationId, previousUrl)) : null }
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

      { messages.length > 0 &&
        <div className="Conversation-replyFormContainer">
          <ConversationReplyForm conversation={ conversation } autoFocus />
        </div>
      }

      {/*initialValue={ conversation.draft }
      onTextChange={ text => conversationDraftChange(conversation.id, text) }
      onTyping={ () => this.presenceChannel.trigger("client-user_is_typing", loggedUser) }
      onAttachShoutClick={ () => this.setState({ showAttachShout: true }) }
      onSubmit={ text => replyToConversation(loggedUser, conversation.id, text) }*/}


      <ConversationDeleteDialog
        open={ showDelete }
        onRequestClose={ () => this.setState({ showDelete: false }) }
        onConfirm={ () =>
          dispatch(deleteConversation(conversationId)).then(() =>
            dispatch(replace("/messages")))
        }
        isDeleting={ conversation.isDeleting }
      />
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
  const {
    paginated: { chat, messagesByConversation },
    entities,
    session: { user: loggedUser }
  } = state;

  const conversationId = ownProps.params.id;

  let props = {
    isFetching: chat.isFetching,
    conversationId: conversationId,
    loggedUser,
    isFetchingMessages: true,
    error: chat.error
  };

  const conversation = entities.conversations[conversationId];

  if (!chat.isFetching && conversation) {
    props = {
      ...props,
      conversation: denormalize(conversation, entities, "CONVERSATION")
    };
  }

  if (messagesByConversation[conversationId]) {
    const {
      ids,
      isFetching: isFetchingMessages,
      previousUrl,
      error: messagesError
    } = messagesByConversation[conversationId];

    const messages = ids.map(id =>
        denormalize(entities.messages[id], entities, "MESSAGE")
      ).sort((a, b) => a.createdAt - b.createdAt);

    props = {
      ...props,
      isFetchingMessages,
      previousUrl,
      messagesError,
      messages
    };
  }

  return props;
}

export default connect(mapStateToProps)(Conversation);
