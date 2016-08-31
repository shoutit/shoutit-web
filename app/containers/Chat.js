import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import Helmet from '../utils/Helmet';
import { getCountryName } from '../utils/LocationUtils';
import { getCurrentLocation } from '../reducers/currentLocation';

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
  publicChatsTitle: {
    id: 'publicChats.page.title',
    defaultMessage: 'Public Chats',
  },
});

export class Chat extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    country: PropTypes.string.isRequired,
    chatType: PropTypes.oneOf(['conversations', 'public_chats']),
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    type: 'conversations',
  }

  render() {
    const { chatType, intl, country, params } = this.props;
    return (
      <RequiresLogin>
        <Page>
          <Helmet
            title={ intl.formatMessage(chatType === 'conversations' ?
              MESSAGES.title :
              MESSAGES.publicChatsTitle)
            }
            appUrl="shoutit://chats"
           />
          <Body>
            <div className="Chat">
              <div className="Chat-conversations">
                <div className="Chat-conversations-title">
                  <Link to={ `${chatType === 'public_chats' ? '/chat' : '/messages'}` }>
                    <h1>
                    { chatType === 'public_chats' ?
                      <FormattedMessage
                        id="publicChat.conversations.title"
                        defaultMessage="Public Chats in {countryName}"
                        values={ {
                          countryName: getCountryName(country),
                        } }
                      /> :
                      <FormattedMessage
                        id="chat.conversations.title"
                        defaultMessage="Conversations"
                      />
                    }
                    </h1>
                  </Link>
                </div>
                <div className="Chat-conversations-list">
                  <ConversationsList
                    chatType={ chatType }
                    showConversationDropdown
                    selectedId={ params.conversationId }
                  />
                </div>
              </div>

              { params.conversationId &&
                <div className="Chat-conversation">
                  <div className="Chat-conversation-body">
                    <Conversation id={ params.conversationId } />
                  </div>
                </div>
              }

              { !params.conversationId &&
                <div className="Chat-conversation Chat-placeholder htmlAncillary">
                  <FormattedMessage
                    id="chat.conversations.notSelected"
                    defaultMessage="Pick a conversation from the left."
                  />
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

const mapStateToProps = state => ({
  country: getCurrentLocation(state).country,
});

export default connect(mapStateToProps, null)(injectIntl(Chat));
