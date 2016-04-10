import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import ConversationTitle from '../chat/ConversationTitle';
// import ConversationDeleteDialog from '../chat/ConversationDeleteDialog';
// import UserShoutsSelectDialog from '../users/UserShoutsSelectDialog';
import MessagesList from '../chat/MessagesList';
import ConversationReplyForm from '../chat/ConversationReplyForm';
import MessagesTypingUsers from '../chat/MessagesTypingUsers';
import Scrollable from '../ui/Scrollable';

import { loadMessages, deleteConversation, setCurrentConversation, unsetCurrentConversation } from '../actions/chat';
import { denormalize } from '../schemas';

import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./Conversation.scss');
}

export class Conversation extends React.Component {

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: [],
  };

  componentDidMount() {
    const { dispatch, conversationId } = this.props;
    dispatch(loadMessages(conversationId));
    dispatch(setCurrentConversation(conversationId));
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
      dispatch(setCurrentConversation(conversationId));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(unsetCurrentConversation());
  }

  render() {

    const { error, messagesError } = this.props;
    const { loggedUser, isFetchingMessages, isFetching, conversation, messages = [], typingUsers } = this.props;
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

    const { showAttachShout, showDelete } = this.state;
    return (
      <div className="Conversation">

        <ConversationTitle
          conversation={ conversation }
          me={ me }
          onDeleteConversationClick={ () => this.setState({ showDelete: true }) }
          onDeleteMessagesTouchTap={ () => {} }

        />
        {/* showVideoCallButton={ videoCallState.initialized }*/}

        {/* onVideoCallClick={ () =>
          previewVideoCall(conversation.profiles.find(user => user.username !== me))
        }*/}

      { isFetchingMessages && messages.length === 0 && <Progress /> }

      { messages.length > 0 &&
        <Scrollable
          uniqueId={ messages[messages.length - 1].id }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ previousUrl ? () => dispatch(loadMessages(conversationId, previousUrl)) : null }
        >
          <div className="Conversation-messagesList">
            <div className="Conversation-listTopSeparator" />
            <div
              className="Conversation-progress"
              style={ isFetchingMessages ? null : { visibility: 'hidden' }}>
              <Progress />
            </div>

            <MessagesList
              loggedUser={ loggedUser }
              messages={ messages }
              partecipants={ conversation.profiles }
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

      {/*<ConversationDeleteDialog
        open={ showDelete }
        onRequestClose={ () => this.setState({ showDelete: false }) }
        onConfirm={ () => {
          dispatch(deleteConversation(conversationId));
          dispatch(replace('/messages'));
        }}
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
  const {
    paginated: { chat, messagesByConversation },
    entities,
    session: { user: loggedUser },
  } = state;

  const conversationId = ownProps.params.id;

  let props = {
    isFetching: chat.isFetching,
    conversationId,
    loggedUser,
    isFetchingMessages: true,
    error: chat.error,
  };

  const conversation = entities.conversations[conversationId];

  if (!chat.isFetching && conversation) {
    props = {
      ...props,
      conversation: denormalize(conversation, entities, 'CONVERSATION'),
    };
  }

  if (messagesByConversation[conversationId]) {
    const {
      ids,
      isFetching: isFetchingMessages,
      previousUrl,
      error: messagesError,
    } = messagesByConversation[conversationId];

    const messages = ids.map(id =>
        denormalize(entities.messages[id], entities, 'MESSAGE')
      ).sort((a, b) => a.createdAt - b.createdAt);

    let typingUsers;
    if (state.chat.typingUsers[conversationId]) {
      typingUsers = state.chat.typingUsers[conversationId].map(id => entities.users[id]);
    }

    props = {
      ...props,
      isFetchingMessages,
      previousUrl,
      messagesError,
      messages,
      typingUsers,
    };
  }

  return props;
}

export default connect(mapStateToProps)(Conversation);
