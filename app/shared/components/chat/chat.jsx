import React from 'react';
import { FluxMixin, StoreWatchMixin } from 'fluxxor';

import { Column, Grid } from '../helper';

import DocumentTitle from 'react-document-title';

import Conversations from './conversations/Conversations.jsx';
import Messages from './message/Messages.jsx';
import MessagesIndex from './message/MessagesIndex.jsx';

export default React.createClass({

  displayName: 'Chat',

  mixins: [new FluxMixin(React), new StoreWatchMixin('messages')],

  componentDidMount() {
    this.getFlux().actions.loadConversations(this.loadActiveConversation);
    this.scrollToBottom();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.params.conversationId !== this.props.params.conversationId) {
      // Load the active conversation as the route's param conversationId changes
      this.loadActiveConversation();
    }
    this.scrollToBottom();
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

  scrollToBottom() {
    // TODO: scroll to the last message in the message list
    //
    // et node = React.findDOMNode(this.refs.chatContent);

    // if (node.scrollTop + node.offsetHeight + 1 < node.scrollHeight) {
    //   node.scrollTop = node.scrollHeight;
    // }
  },

  render() {
    const { conversations, me, loading, draft } = this.state;
    const { pushState } = this.props.history;
    const activeConversation = this.getActiveConversation();

    const {
      loadMoreConversation,
      replyConversation,
      messageDraftChange
    } = this.getFlux().actions;

    return (
      <DocumentTitle title="Chats - Shoutit">
        <Grid fluid className="ChatContainer">
          <Column fluid size={5} clear>
            <Conversations
              conversations={ conversations }
              activeConversation={ activeConversation }
              me={ me }
              onConversationClick={ (conversationId) => pushState(null, `/chat/${conversationId}`) }
            />
          </Column>
          <Column fluid size={10}>
            { activeConversation
              ? <Messages
                  conversation={ activeConversation }
                  draft={ draft }
                  me={ me }
                  loading= { !activeConversation.messages }
                  onLoadMoreMessagesClick={ (before) => loadMoreConversation(activeConversation.id, before) }
                  onReplyTextChange={ (text) => messageDraftChange('text', text) }
                  onReplySubmit={ () => replyConversation(activeConversation.id, draft) }
                />
              : <MessagesIndex
                  conversations={ conversations }
                  loading={ loading }
                />
            }
          </Column>
        </Grid>
      </DocumentTitle>
    );
  }

});
