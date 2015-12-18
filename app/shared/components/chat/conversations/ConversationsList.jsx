import React from 'react';
import ConversationItem from './ConversationItem.jsx';

export default function ConversationsList({ conversations, me, activeConversation, onConversationClick }) {

  if (conversations.length === 0) {
    return <span />
  }

  return (
    <ul className="ConversationsList">
      { conversations.map((conversation, i) =>
        <li
          key={ i }
          tabIndex={ 0 }>
          <ConversationItem
            conversation={ conversation }
            me={ me }
            onClick= { onConversationClick }
            selected={ activeConversation && activeConversation.id === conversation.id }
          />
        </li>
      )}
    </ul>
  );
}
