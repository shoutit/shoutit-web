import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ConversationReplyForm from '../chat/ConversationReplyForm';
import ConversationMessages from '../chat/ConversationMessages';
import ConversationAbout from '../chat/ConversationAbout';
import ConversationName from '../chat/ConversationName';

import { loadConversation, setActiveConversation, unsetActiveConversation, readConversation } from '../actions/conversations';

import { getConversation } from '../selectors';

import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./Conversation.scss');
}

export class Conversation extends Component {

  static propTypes = {

    id: PropTypes.string.isRequired,

    loadConversation: PropTypes.func.isRequired,
    unsetActive: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    markAsRead: PropTypes.func.isRequired,

    conversation: PropTypes.object,
    draft: PropTypes.string,

    layout: PropTypes.oneOf(['hosted', 'full']),
  };

  static defaultProps = {
    layout: 'full',
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetching: false,
    };
  }

  state = {
    showDelete: false,
    showAttachShout: false,
    typingUsers: [],
  };

  componentDidMount() {
    this.loadData();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.draft === this.props.draft;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.unsetActive();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    this.props.unsetActive();
  }

  loadData() {
    if (this.props.conversation && this.props.conversation.isNew) {
      return;
    }
    this.setState({ isFetching: true, error: null });
    this.props.loadConversation()
    .then(() => {
      this.setState({ isFetching: false });
      this.props.setActive();
      this.props.markAsRead();
    })
    .catch(error => {
      this.setState({ isFetching: false, error });
    });

    if (this.form) {
      this.form.focus();
    }
  }

  form = null;

  render() {
    const { layout, conversation } = this.props;
    return (
      <div className={ `Conversation layout-${layout}` }>

        { layout === 'full' && conversation &&
          <h1>
            <ConversationName conversation={ conversation } />
          </h1>
        }

        { conversation && conversation.type === 'about_shout' &&
          <ConversationAbout shout={ conversation.about } /> }

        { !conversation && this.state.error &&
          <div className="Conversation-error">
            Could not load conversation
          </div>
        }

        { !conversation && this.state.isFetching && <Progress animate /> }

        { conversation && <ConversationMessages conversation={ conversation } /> }

{/*
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
        */
       }
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

const mapStateToProps = (state, ownProps) => ({
  conversation: getConversation(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadConversation: () => dispatch(loadConversation({ id: ownProps.id })),
  setActive: () => dispatch(setActiveConversation({ id: ownProps.id })),
  unsetActive: () => dispatch(unsetActiveConversation({ id: ownProps.id })),
  markAsRead: () => dispatch(readConversation({ id: ownProps.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
