import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import FixedHeightPage from '../layout/FixedHeightPage';
import Page from '../layout/Page';
import ConversationsList from '../chat/ConversationsList';
import Conversation from '../chat/Conversation';

import SuggestedShout from '../shouts/SuggestedShout';

import RequiresLogin from '../auth/RequiresLogin';

import { denormalize } from '../schemas';
import { getConversationName } from '../chat/ChatUtils';
import { closeConversation } from '../actions/chat';

if (process.env.BROWSER) {
  require('./Chat.scss');
}

export class Chat extends React.Component {

  render() {
    const { params, loggedUser, isFetching, conversations, conversation, dispatch } = this.props;
    return (
      <RequiresLogin>
        <FixedHeightPage>
          <Page title="Messages" endColumn={ <SuggestedShout /> }>
            <div className="Chat">
              <div className="Chat-conversations">
                <div className="Chat-conversations-title">
                  <Link to="/messages">
                    <h1>Conversations</h1>
                  </Link>
                </div>
                <div className="Chat-conversations-list">
                  <ConversationsList
                    conversations={ conversations }
                    selectedId={ params.conversationId }
                    isFetching={ isFetching }
                    loggedUser={ loggedUser }
                    onConversationClick={ conversation => dispatch(closeConversation(conversation.id)) }
                  />
                </div>
              </div>

              { params.conversationId &&
                <div className="Chat-conversation">
                  <div className="Chat-conversation-header">
                    <h1>
                      { conversation ? getConversationName(conversation, loggedUser) : null }
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
  const { entities: { conversations, ...entities }, paginated: { chat } } = state;
  const { conversationId } = ownProps.params;
  return {
    loggedUser: state.session.user,
    isFetching: chat.isFetching,
    conversations: chat.ids.map(id => denormalize(conversations[id], entities, 'CONVERSATION')),
    conversation: conversationId && conversations[conversationId] ?
      denormalize(conversations[conversationId], entities, 'CONVERSATION') :
      undefined,
  };
};
export default connect(mapStateToProps)(Chat);
