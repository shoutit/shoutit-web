import React from 'react';

import ConversationsTitle from '../chat/ConversationsTitle.jsx';
import ConversationsList from '../chat/ConversationsList.jsx';

export default function Conversations({ conversations=[], me, activeConversation, onConversationClick }) {
  const unread = conversations.filter(c => c.unread_messages_count > 0);
  return (
    <div>
      <ConversationsTitle unreadCount={ unread.length } />
      <ConversationsList
        onConversationClick={ onConversationClick }
        conversations={ conversations }
        me={ me }
        activeConversation={activeConversation}
      />
    </div>
  );
}
