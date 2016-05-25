import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MessagesList from '../chat/MessagesList';
import MessagesTypingUsers from '../chat/MessagesTypingUsers';
import Scrollable from '../ui/Scrollable';

import { loadMessages } from '../actions/messages';

import { getPaginationStatus, getMessagesByConversation } from '../selectors';

import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./Conversation.scss');
}

export class ConversationMessages extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,

    conversation: PropTypes.object.isRequired,
    messages: PropTypes.array,

    error: PropTypes.object,
    isFetching: PropTypes.bool,
    previousUrl: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleScrollTop = this.handleScrollTop.bind(this);
  }

  componentDidMount() {
    this.props.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.conversation.id !== prevProps.conversation.id) {
      this.props.loadData();
    }
  }

  handleScrollTop() {
    if (this.props.previousUrl) {
      this.props.loadData(this.props.previousUrl);
    }
  }

  render() {
    const { isFetching, error, conversation, messages } = this.props;
    const uniqueId = messages.length > 0 ? messages[messages.length - 1].id : 'empty';
    return (
      <Scrollable
        preventDocumentScroll
        uniqueId={ uniqueId }
        initialScroll="bottom"
        className="Conversation-scrollable"
        ref="scrollable"
        onScrollTop={ this.handleScrollTop }>
        <div className="Conversation-messagesList">

          <Progress animate={ isFetching } />

          { error &&
            <div className="Conversation-error">
              Could not load messages
            </div>
          }

          { messages.length > 0 &&
            <MessagesList messages={ messages } partecipants={ conversation.profiles } />
          }

          { <MessagesTypingUsers users={ [] } /> }

        </div>

      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  messages: getMessagesByConversation(state, ownProps.conversation.id),
  ...getPaginationStatus(state, `messagesByConversation.${ownProps.conversation.id}`),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadMessages(ownProps.conversation, endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMessages);
