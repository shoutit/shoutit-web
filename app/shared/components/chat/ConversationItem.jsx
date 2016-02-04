import React from "react";
import { Link } from "react-router";

import ManyUsersImage from "../user/ManyUsersImage.jsx";
import { formatCreatedAt } from "../../../utils/DateUtils";

if (process.env.BROWSER) {
  require("styles/components/ConversationItem.scss");
}

export default function ConversationItem({ id, type, users, last_message, about, me, selected=false, unread=false }) {

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  let className = "ConversationItem";

  if (selected) {
    className = `${className} isSelected`;
  }

  if (unread) {
    className = `${className} isUnread`;
  }

  return (
    <Link to={ `/messages/${id}` } className={ className }>
      <div className="ConversationItem-usersImage">
        <ManyUsersImage users={ users.filter(user => user.username !== me) } />
      </div>

      <div className="ConversationItem-body">

        { type === "about_shout" &&
          <div className="ConversationItem-aboutShout">
            {about.title}
          </div>
        }

        <div className="ConversationItem-partecipants">
          { partecipants }
        </div>

        { last_message &&
          <div className="ConversationItem-lastMessage" title={ last_message.text }>
            { last_message.text }
          </div>
        }
      </div>

      { last_message &&
        <div className="ConversationItem-createdAt">
          { formatCreatedAt(last_message.created_at) }
        </div>
      }
    </Link>
  );
}
