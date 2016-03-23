import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import ConversationsList from "../chat/ConversationsList.js";

import { denormalize } from "../schemas";

if (process.env.BROWSER) {
  require("styles/components/ListOverlay.scss");
}

export function HeaderMessagesOverlay({ loggedUser, isFetching, conversations=[], onMarkAsReadClick }) {
  const enableMarkAllAsRead = false; // wait for https://github.com/shoutit/shoutit-web/issues/98
  const unreadCount = conversations.filter(c => c.unreadMessagesCount > 0).length;
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
      { (isFetching || conversations.length > 0) ?
        <ConversationsList
          conversations={ conversations }
          isFetching={ isFetching }
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

const mapStateToProps = state => {
  const { entities: { conversations, ...entities }, paginated: { chat } } = state;
  const props = {
    loggedUser: state.session.user,
    isFetching: chat.isFetching,
    conversations: chat.ids.map(id => denormalize(conversations[id], entities, "CONVERSATION"))
  };
  return props;
};
export default connect(mapStateToProps)(HeaderMessagesOverlay);
