import React from 'react';
import {Col} from 'react-bootstrap';

import ConversationsTitle from './ConversationsTitle.jsx';
import ConversationsList from './ConversationsList.jsx';

import {Clear} from '../../helper';

export default function Conversations({ conversations=[], me, activeConversation }) {
  const unread = conversations.filter(c => c.unread_messages_count > 0);
  return (
    <Col xs={12} md={12} className="chat-left">
      <ConversationsTitle unreadCount={ unread.length } />
      <Clear/>
      <ConversationsList
        conversations={ conversations }
        me={ me }
        activeConversation={activeConversation}
      />
    </Col>
  );
}
