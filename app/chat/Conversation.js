import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MessagesList from '../chat/MessagesList';
import ConversationReplyForm from '../chat/ConversationReplyForm';
import ConversationAbout from '../chat/ConversationAbout';
import ConversationStart from '../chat/ConversationStart';
import MessagesTypingUsers from '../chat/MessagesTypingUsers';
import Scrollable from '../ui/Scrollable';

import { setActiveConversation, unsetActiveConversation, readConversation } from '../actions/conversations';
import { loadMessages } from '../actions/messages';
import { denormalize } from '../schemas';

import { getLoggedUser } from '../selectors';

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

    layout: PropTypes.oneOf(['hosted', 'full']),
  };

  static defaultProps = {
    layout: 'full',
  }

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: [],
  };

  componentDidMount() {
    const { dispatch, id, conversation } = this.props;
    if (!conversation || !conversation.isNew) {
      dispatch(setActiveConversation({ id }));
      dispatch(loadMessages({ id }));
    }
    if (conversation && conversation.unreadMessagesCount > 0) {
      dispatch(readConversation(conversation));
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
      dispatch(unsetActiveConversation({ id: prevProps.id }));
      dispatch(setActiveConversation({ id }));
      dispatch(loadMessages({ id }));
      if (conversation && conversation.unreadMessagesCount > 0) {
        dispatch(readConversation(conversation));
      }
    }
  }

  componentWillUnmount() {
    const { dispatch, id } = this.props;
    dispatch(unsetActiveConversation({ id }));
  }

  form = null;

  render() {
    const { error, messagesError, layout } = this.props;
    const { loggedUser, isFetchingMessages, conversation, messages = [], typingUsers } = this.props;
    const { previousUrl, dispatch, id } = this.props;
    return (
      <div className={ `Conversation layout-${layout}` }>
        { conversation && conversation.type === 'about_shout' &&
          <ConversationAbout shout={ conversation.about } /> }

        <Scrollable
          preventDocumentScroll
          uniqueId={ messages.length > 0 ? messages[messages.length - 1].id : 'empty' }
          initialScroll="bottom"
          className="Conversation-scrollable"
          ref="scrollable"
          onScrollTop={ previousUrl ? () => dispatch(loadMessages({ id }, previousUrl)) : null }>
          <div className="Conversation-messagesList" onClick={ () => this.form && this.form.focus() }>

            { error &&
              <div className="Conversation-error">
                Could not load conversation - <a href="#" onClick={ e => { e.preventDefault(); dispatch(loadMessages({ id }, previousUrl)); } }>retry?</a>
              </div>
            }

            { messagesError &&
              <div className="Conversation-error">
                Could not load messages - <a href="#" onClick={ e => { e.preventDefault(); dispatch(loadMessages({ id }, previousUrl)); } }>retry?</a>
              </div>
            }

            { conversation && conversation.createError &&
              <div className="Conversation-error">
                { conversation.createError.message }
              </div>
            }

            { (!conversation || !conversation.isNew) &&
              <Progress animate={ !conversation || isFetchingMessages } />
            }
            { conversation && messages.length > 0 &&
              <MessagesList
                loggedUser={ loggedUser }
                messages={ messages }
                partecipants={ conversation.profiles }
              />
            }

            { conversation && conversation.isNew && !conversation.isCreating &&
              <ConversationStart conversation={ conversation } />
            }
            { conversation && conversation.isNew && conversation.isCreating &&
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
  const conversation = denormalize(entities.conversations[id], entities, 'CONVERSATION');
  const loggedUser = getLoggedUser(state);
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
    loggedUser,
    conversation,
    messages,
    isFetchingMessages,
    previousUrl,
    messagesError,
    typingUsers,
  };
};


export default connect(mapStateToProps)(Conversation);
