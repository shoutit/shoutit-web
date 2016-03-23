import React from "react";

import ConversationItem from "./ConversationItem";
import Progress from "../shared/components/helper/Progress.jsx";

export default function ConversationsList({ conversations, isFetching, loggedUser, selectedId } ) {

  return (
    <div className="ConversationsList">
      { conversations.length > 0 &&
        <ul className="Chat-conversationsList">
          { conversations
              .sort((a, b) => b.modifiedAt - a.modifiedAt)
              .map(conversation =>
            <li key={ conversation.id } >
              <ConversationItem
                conversation={ conversation }
                me={ loggedUser && loggedUser.username }
                unread = { conversation.unreadMessagesCount > 0 }
                selected={ conversation.id === selectedId }
              />
            </li>
          )}
        </ul>
      }

      { isFetching && conversations.length === 0 && <Progress /> }

    </div>

  );
}
