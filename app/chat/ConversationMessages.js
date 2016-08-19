import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { PaginationPropTypes } from '../utils/PropTypes';

import MessagesList from '../chat/MessagesList';
import Typing from '../chat/Typing';
import Scrollable from '../layout/Scrollable';
import { loadMessages } from '../actions/messages';

import { getMessagesByConversation, getPaginationState } from '../reducers/paginated/messagesByConversation';
import Progress from '../widgets/Progress';

import './ConversationMessages.scss';

export class ConversationMessages extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,

    conversation: PropTypes.object.isRequired,
    messages: PropTypes.array,

    error: PropTypes.object,
    ...PaginationPropTypes,
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
        className="ConversationMessages"
        ref="scrollable"
        onScrollTop={ this.handleScrollTop }>
        <div className="Conversation-messagesList">

          <Progress animate={ isFetching } />
          { error &&
            <div className="Conversation-error">
              <FormattedMessage id="chat.messages.loadError" defaultMessage="Error while loading messages." />
            </div>
          }

          { messages.length > 0 &&
            <MessagesList messages={ messages } />
          }

          <Typing conversationId={ conversation.id } />

        </div>

      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  messages: getMessagesByConversation(state, ownProps.conversation.id),
  ...getPaginationState(state, ownProps.conversation.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadMessages(ownProps.conversation, endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMessages);
