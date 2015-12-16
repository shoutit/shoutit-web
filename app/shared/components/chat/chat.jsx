import React from 'react';
import { FluxMixin, StoreWatchMixin } from 'fluxxor';

import { Col } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';

import Conversations from './conversations/Conversations.jsx';
import Messages from './message/Messages.jsx';
import MessagesIndex from './message/MessagesIndex.jsx';

export default React.createClass({

  displayName: 'Chat',

  mixins: [new FluxMixin(React), new StoreWatchMixin('messages')],

  componentDidMount() {
    this.getFlux().actions.loadConversations(this.loadActiveConversation);
  },

  componentDidUpdate(prevProps) {
    if (prevProps.params.conversationId !== this.props.params.conversationId) {
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

    const activeConversation = this.getActiveConversation();

    const {
      loadMoreConversation,
      replyConversation,
      messageDraftChange
    } = this.getFlux().actions;

    return (
      <DocumentTitle title="Chats - Shoutit">
        <div className="chat">
          <Col xs={12} md={4} className="chat-left-padding">
            <Conversations
              activeConversation={ activeConversation }
              conversations={ conversations }
              me={ me }
            />
          </Col>
          <Col xs={12} md={8} className="chat-left-padding">
            { activeConversation
              ? <Messages
                  conversation={ activeConversation }
                  draft={ draft }
                  me={ me }
                  loading= { !activeConversation.messages }
                  onLoadMoreMessagesClick={ (before) => loadMoreConversation(activeConversation.id, before) }
                  onReplyTextChange={ text => messageDraftChange('text', text) }
                  onReplySubmit={ () => replyConversation(activeConversation.id, draft) }
                />
              : <MessagesIndex
                  conversations={ conversations }
                  loading={ loading }
                />
            }
          </Col>
        </div>
      </DocumentTitle>
    );
  }

});
