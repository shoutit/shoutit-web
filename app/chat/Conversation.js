import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MessagesList from '../chat/MessagesList';
import ConversationReplyForm from '../chat/ConversationReplyForm';
import MessagesTypingUsers from '../chat/MessagesTypingUsers';
import Scrollable from '../ui/Scrollable';
import UserAvatar from '../users/UserAvatar';

import { loadMessages, setCurrentConversation, unsetCurrentConversation } from '../actions/chat';
import { denormalize } from '../schemas';

import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./Conversation.scss');
}

export class Conversation extends Component {

  static propTypes = {

    dispatch: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    loggedUser: PropTypes.object.isRequired,

    conversation: PropTypes.object,
    draft: PropTypes.string,
    error: PropTypes.object,
    isFetching: PropTypes.bool,
    isFetchingMessages: PropTypes.bool,
    messages: PropTypes.array,
    messagesError: PropTypes.object,
    previousUrl: PropTypes.string,
    typingUsers: PropTypes.array,

  };

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: [],
  };

  componentDidMount() {
    const { dispatch, id, conversation } = this.props;
    if (!conversation || !conversation.isNew) {
      dispatch(loadMessages(id)).then(
        () => dispatch(setCurrentConversation(id))
      );
    }
    if (this.form) {
      this.form.focus();
    }
  }

  shouldComponentUpdate(nextProps) {
    // Do not render all again if just draft changed
    if (nextProps.draft !== this.props.draft) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { id, dispatch, conversation } = this.props;
    if (prevProps.id !== id && !(conversation && conversation.isNew)) {
      dispatch(loadMessages(id)).then(
        () => dispatch(setCurrentConversation(id))
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(unsetCurrentConversation());
  }

  form = null;

  render() {
    const { error, messagesError } = this.props;
    const { loggedUser, isFetchingMessages, conversation, messages = [], typingUsers } = this.props;
    const { previousUrl, dispatch, id } = this.props;

    const recipient = conversation ?
      conversation.profiles.filter(profile => profile.id !== loggedUser.id)[0] :
      undefined;

    return (
      <div className="Conversation">
        <Scrollable
          preventDocumentScroll
          uniqueId={ messages.length > 0 ? messages[messages.length - 1].id : 'empty' }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ previousUrl ? () => dispatch(loadMessages(id, previousUrl)) : null }>
          <div className="Conversation-messagesList" onClick={ () => this.form && this.form.focus() }>

            { error && <div className="Conversation-error">
              { error.message }
              </div>
            }

            { messagesError && <div className="Conversation-error">
              { messagesError.message }
              </div>
            }

            { conversation && conversation.createError && <div className="Conversation-error">
              { conversation.createError.error.message }
              </div>
            }

            <Progress animate={ isFetchingMessages } />

            { conversation && messages.length > 0 &&
                <MessagesList
                  loggedUser={ loggedUser }
                  messages={ messages }
                  partecipants={ conversation.profiles }
                />
            }

            { conversation && conversation.isNew && !conversation.isCreating &&
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <UserAvatar user={ recipient } size="large" style={{ marginBottom: '1rem' }} />
                <p className="htmlAncillary">
                  To start chatting, write { recipient.name } a new message.
                </p>
              </div>
            }
            { conversation && conversation.isCreating &&
              <Progress animate label="Sending message…" />
            }

            <MessagesTypingUsers users={ typingUsers } />

          </div>

        </Scrollable>

        { conversation &&
          <div className="Conversation-replyFormContainer">
            <ConversationReplyForm
              inputRef={ form => { this.form = form; } }
              ref="replyForm"
              conversation={ conversation }
              autoFocus
            />
          </div>
        }
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { entities, paginated } = state;
  const { id } = ownProps;
  const conversation = entities.conversations[id] ? denormalize(entities.conversations[id], entities, 'CONVERSATION') : undefined;

  const messagesByConversation = paginated.messagesByConversation[id];

  let messages = [];
  let messagesError;
  let isFetchingMessages = false;
  let previousUrl;
  let typingUsers = [];

  if (messagesByConversation) {
    messages = messagesByConversation.ids.map(messageId => denormalize(entities.messages[messageId], entities, 'MESSAGE'));
    messages = messages.sort((a, b) => a.createdAt - b.createdAt); // show most recent messages last
    isFetchingMessages = messagesByConversation.isFetching;
    previousUrl = messagesByConversation.previousUrl;
    messagesError = messagesByConversation.error;
    if (state.chat.typingUsers[id]) {
      typingUsers = state.chat.typingUsers[id].map(profileId => entities.users[profileId]);
    }
  }

  return {
    loggedUser: state.session.user,
    conversation,
    messages,
    isFetchingMessages,
    previousUrl,
    messagesError,
    typingUsers,
  };
};


export default connect(mapStateToProps)(Conversation);
