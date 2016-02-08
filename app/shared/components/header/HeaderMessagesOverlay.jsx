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
        { unreadConversations &&
          <span className="ListOverlay-action" onClick={ onMarkAsReadClick }>
              Mark All As Read
          </span>
        }
      </div>
      <div className="ListOverlay-body">
      <ConversationsList
        onItemClick={ onItemClick }
        conversations={ conversations }
        loading={ chat.loading }
        loggedUser={ loggedUser }
      />
      </div>
      <div className="ListOverlay-footer">
        <Link to="/messages">
            See All
        </Link>
      </div>
    </div>

  );
}
