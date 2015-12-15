import React from 'react';
import ConversationItem from './ConversationItem.jsx';

export default function ConversationsList({ conversations, me }) {

  if (conversations.length === 0) {
    return <span />
  }

  return (
    <ul>
      { conversations.map((conversation, i) =>
        <li>
          <ConversationItem
            key={ i }
            conversation={ conversation }
            me={ me }
          />
        </li>
      )}
    </ul>
  );
}
