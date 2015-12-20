import React from 'react';
import { FluxMixin, StoreWatchMixin } from 'fluxxor';

import Page from '../helper/Page.jsx';
import Conversations from '../chat/Conversations.jsx';
import Messages from '../chat/Messages.jsx';
import MessagesIndex from '../chat/MessagesIndex.jsx';

export default React.createClass({

  displayName: 'ChatContainer',

  mixins: [new FluxMixin(React), new StoreWatchMixin('messages')],

  componentDidMount() {
    this.getFlux().actions.loadConversations(this.loadActiveConversation);
  },

  componentDidUpdate(prevProps) {
    if (prevProps.params.conversationId !== this.props.params.conversationId) {
      // Load the active conversation as the route's param conversationId changes
      this.loadActiveConversation();
    }
  },

  getStateFromFlux() {
    return this.getFlux().store('messages').getState();
  },

  getActiveConversation() {
    if (!this.props.params.conversationId) {
      return;
    }
    return this.state.conversations.find(conversation =>
      conversation.id === this.props.params.conversationId
    )
  },

  loadActiveConversation() {
    if (!this.props.params.conversationId) {
      return;
    }
    this.getFlux().actions.loadConversation(this.props.params.conversationId);
  },

  render() {
    const { conversations, me, loading, draft } = this.state;
    const { history, flux } = this.props;
    const activeConversation = this.getActiveConversation();

    const {
      loadMoreConversation,
      replyConversation,
      messageDraftChange
    } = this.getFlux().actions;

    return (
      <Page fixedHeight title="Chats – Shoutit" flux={ flux } rightContent={ <p>Right board</p> }>
        <div className="ChatContainer">

          <div className="ChatContainer-conversations">
            <Conversations
              conversations={ conversations }
              activeConversation={ activeConversation }
              me={ me }
              onConversationClick={ ({id}) => history.pushState(null, `/chat/${id}`) }
            />
          </div>

          <div className="ChatContainer-messages">

            { activeConversation
              ? <Messages
                  conversation={ activeConversation }
                  draft={ draft }
                  me={ me }
                  lastMessageId={activeConversation.last_message.id}
                  loading={ !activeConversation.messages }
                  onLoadMoreMessagesClick={ (before) => loadMoreConversation(activeConversation.id, before) }
                  onReplyTextChange={ (text) => messageDraftChange('text', text) }
                  onReplySubmit={ () => replyConversation(activeConversation.id, draft) }
                />
              : <MessagesIndex
                  conversations={ conversations }
                  loading={ loading }
                />
            }

          </div>

        </div>
      </Page>
    );
  }

});
