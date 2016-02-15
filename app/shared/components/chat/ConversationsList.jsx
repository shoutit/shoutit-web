import React from "react";
import ConversationItem from "../chat/ConversationItem.jsx";
import Progress from "../helper/Progress.jsx";

export default function ConversationList({ conversations, loading, loggedUser, selectedId, onItemClick } ) {

  return (
    <div className="ConversationsList">
      { conversations.length > 0 &&
        <ul className="Chat-conversationsList">
          { conversations.map(conversation =>
            <li key={ conversation.id } >
              <ConversationItem
                { ...conversation }
                me={ loggedUser && loggedUser.username }
                unread = { conversation.unread_messages_count > 0 }
                selected={ conversation.id === selectedId }
                onClick={ onItemClick }
              />
            </li>
          )}
        </ul>
      }

      { loading && conversations.length === 0 && <Progress /> }

    </div>

  );
}
