import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import FixedHeightPage from '../layout/FixedHeightPage';
import Page from '../layout/Page';
import ConversationsList from '../chat/ConversationsList';
// import ConversationName from '../chat/ConversationName';
import Conversation from '../chat/Conversation';

import SuggestedShout from '../shouts/SuggestedShout';

import RequiresLogin from '../auth/RequiresLogin';

if (process.env.BROWSER) {
  require('./Chat.scss');
}

export default class Chat extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  render() {
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
                    selectedId={ this.props.params.conversationId }
                  />
                </div>
              </div>

              { this.props.params.conversationId &&
                <div className="Chat-conversation">
                  <div className="Chat-conversation-body">
                    <Conversation id={ this.props.params.conversationId } />
                  </div>
                </div>
              }

              { !this.props.params.conversationId &&
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
