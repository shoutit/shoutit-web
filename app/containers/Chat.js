import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import FixedHeightPage from '../layout/FixedHeightPage';
import Page from '../layout/Page';
import ConversationsList from '../chat/ConversationsList';
import ConversationName from '../chat/ConversationName';
import Conversation from '../chat/Conversation';

import SuggestedShout from '../shouts/SuggestedShout';

import RequiresLogin from '../auth/RequiresLogin';

import { denormalize } from '../schemas';
import { closeConversation } from '../actions/chat';

if (process.env.BROWSER) {
  require('./Chat.scss');
}

export class Chat extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    conversations: PropTypes.array,
    conversation: PropTypes.object,
  }

  render() {
    const { params, isFetching, conversations, conversation, dispatch } = this.props;
    return (
      <RequiresLogin>
        <FixedHeightPage>
          <Page endColumn={ <SuggestedShout /> }>
            <Helmet title="Messages" />
            <div className="Chat">
              <div className="Chat-conversations">
                <div className="Chat-conversations-title">
                  <Link to="/messages">
                    <h1>Conversations</h1>
                  </Link>
                </div>
                <div className="Chat-conversations-list">
                  <ConversationsList
                    showConversationDropdown
                    conversations={ conversations }
                    selectedId={ params.conversationId }
                    isFetching={ isFetching }
                    onConversationClick={ conversation => dispatch(closeConversation(conversation.id)) }
                  />
                </div>
              </div>

              { params.conversationId &&
                <div className="Chat-conversation">
                  <div className="Chat-conversation-header">
                    <h1>
                      { conversation ? <ConversationName conversation={ conversation } /> : null }
                    </h1>
                  </div>
                  <div className="Chat-conversation-body">
                    <Conversation id={ params.conversationId } />
                  </div>
                </div>
              }

              { !params.conversationId &&
                <div className="Chat-conversation Chat-placeholder htmlAncillary">
                  Pick a conversation from the left.
                </div>
              }

            </div>
          </Page>
        </FixedHeightPage>
      </RequiresLogin>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities, paginated } = state;
  const { conversationId } = ownProps.params;
  return {
    isFetching: paginated.chatConversations.isFetching,
    conversations: paginated.chatConversations.ids.map(id => denormalize(entities.conversations[id], entities, 'CONVERSATION')),
    conversation: denormalize(entities.conversations[conversationId], entities, 'CONVERSATION'),
  };
};
export default connect(mapStateToProps)(Chat);
