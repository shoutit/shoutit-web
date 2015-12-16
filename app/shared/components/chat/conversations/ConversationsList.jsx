import React from 'react';
import ConversationItem from './ConversationItem.jsx';

export default function ConversationsList({ conversations, me, activeConversation }) {

  if (conversations.length === 0) {
    return <span />
  }

  return (
    <ul>
      { conversations.map((conversation, i) =>
        <li key={ i }>
          <ConversationItem
            conversation={ conversation }
            me={ me }
            selected={ activeConversation && activeConversation.id === conversation.id }
          />
        </li>
      )}
    </ul>
  );
}
