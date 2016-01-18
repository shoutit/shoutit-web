import React from "react";

import ConversationsTitle from "../chat/ConversationsTitle.jsx";
import ConversationItem from "../chat/ConversationItem.jsx";

export default function ConversationsList({ conversations=[], me, selectedId }) {
  const unread = conversations.filter(c => c.unread_messages_count > 0);
  return (
    <div>
      { conversations.length > 0 &&
        <ul className="ConversationsList">
          { conversations.map(conversation =>
            <li key={ conversation.id }>
              <ConversationItem
                { ...conversation }
                me={ me }
                selected={ selectedId === conversation.id }
              />
            </li>
          )}
        </ul>
      }
    </div>
  );
}
