import React from "react";
import { Link } from "react-router";
import ConversationsList from "../chat/ConversationsList.jsx";

if (process.env.BROWSER) {
  require("styles/components/ListOverlay.scss");
}

export default function HeaderMessagesOverlay({ loggedUser, chat, conversations, unreadConversations, onMarkAsReadClick, onItemClick }) {

  return (
    <div className="ListOverlay">
      <div className="ListOverlay-header">
        <span className="ListOverlay-title">
          Messages
          { unreadConversations > 0 && <span> ({ unreadConversations })</span> }
        </span>
        { unreadConversations > 0 ?
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
      <div className="ListOverlay-footer">
        <Link to="/messages">
            See All
        </Link>
      </div>
    </div>

  );
}
