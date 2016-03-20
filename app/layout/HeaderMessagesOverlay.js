import React from "react";
import { Link } from "react-router";
import ConversationsList from "../chat/ConversationsList.js";

if (process.env.BROWSER) {
  require("styles/components/ListOverlay.scss");
}

export default function HeaderMessagesOverlay({ loggedUser, chat, conversations, unreadCount, onMarkAsReadClick, onItemClick }) {
  const enableMarkAllAsRead = false; // wait for https://github.com/shoutit/shoutit-web/issues/98
  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          Messages
          { unreadCount > 0 && <span> ({ unreadCount })</span> }
        </span>
        { enableMarkAllAsRead && !unreadCount > 0 ?
          <span className="ListOverlay-action" onClick={ onMarkAsReadClick }>
              Mark All As Read
          </span> : null
        }
      </div>
      <div className="ListOverlay-body">
      { (chat.loading || conversations.length > 0) ?
        <ConversationsList
          onItemClick={ onItemClick }
          conversations={ conversations }
          loading={ chat.loading }
          loggedUser={ loggedUser }
        /> :
        <div className="ListOverlay-empty">
          <p>No messages</p>
        </div>
      }
      </div>
      { conversations.length > 0 && <div className="ListOverlay-footer">
        <Link to="/messages">
            See All
        </Link>
      </div>
      }
    </div>

  );
}
