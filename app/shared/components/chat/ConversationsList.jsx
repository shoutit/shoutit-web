import React from 'react';
import ConversationItem from '../chat/ConversationItem.jsx';

export default function ConversationsList({ conversations, me, activeConversation, onConversationClick }) {

  if (conversations.length === 0) {
    return <span />
  }

  return (
    <ul className="ConversationsList">
      { conversations.map((conversation, i) =>
        <li
          key={ i }
          onClick= { (e) => onConversationClick(conversation, e) }>
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
