import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import Helmet from '../utils/Helmet';

import Page, { Body, EndColumn } from '../layout/Page';
import ConversationsList from '../chat/ConversationsList';
import Conversation from '../chat/Conversation';

import SuggestedShout from '../shouts/SuggestedShout';

import RequiresLogin from '../auth/RequiresLogin';

import './Chat.scss';

const MESSAGES = defineMessages({
  title: {
    id: 'chat.page.title',
    defaultMessage: 'Messages',
  },
});

export class Chat extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  render() {
    return (
      <RequiresLogin>
        <Page>
          <Helmet title={ this.props.intl.formatMessage(MESSAGES.title) } />
          <Body>
            <div className="Chat">
              <div className="Chat-conversations">
                <div className="Chat-conversations-title">
                  <Link to="/messages">
                    <h1>
                      <FormattedMessage id="chat.conversations.title" defaultMessage="Conversations" />
                    </h1>
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
                  <FormattedMessage id="chat.conversations.notSelected" defaultMessage="Pick a conversation from the left." />
                </div>
              }

            </div>
          </Body>
          <EndColumn>
            <SuggestedShout />
          </EndColumn>
        </Page>
      </RequiresLogin>
    );
  }
}

export default injectIntl(Chat);
