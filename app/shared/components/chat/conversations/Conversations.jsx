import React, {PropTypes} from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Col} from 'react-bootstrap';

import ConversationsTitle from './ConversationsTitle.jsx';
import ConversationsList from './ConversationsList.jsx';

import {Clear} from '../../helper';

export default React.createClass({

  displayName: 'Conversations',

  propTypes: {
    chatId: PropTypes.string
  },

  mixins: [
    new FluxMixin(React),
    new StoreWatchMixin('messages')
  ],

  componentDidMount() {
    this.getFlux().actions.loadConversations();
  },

  getStateFromFlux() {
    const { conversations, me } = this.getFlux().store('messages').getState();
    return {
      conversations: conversations === null ? [] : conversations,
      me
    }
  },

  render() {

    const { conversations, me } = this.state;

    const unread = conversations.filter(c => c.unread_messages_count > 0);

    return (
      <Col xs={12} md={12} className="chat-left">
        <ConversationsTitle unreadCount={ unread.length } />
        <Clear/>
        <ConversationsList conversations={ conversations } me={ me } />
      </Col>
    );
  }

});
