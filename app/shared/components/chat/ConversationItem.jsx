import React from "react";
import {Link} from "react-router";

import ManyUsersImage from "../user/ManyUsersImage.jsx";
import { formatCreatedAt } from "../../../utils/DateUtils";

export default function ConversationItem({ conversation, me, selected }) {
  const { users, last_message: lastMessage, about } = conversation;

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  return (
    <Link to={ `/chat/${conversation.id}` }
      className={ `ConversationItem${selected ? " isSelected" : ""} `}>
      <div className="ConversationItem-usersImage">
        <ManyUsersImage users={ users.filter(user => user.username !== me) } />
      </div>

      <div className="ConversationItem-body">

        { conversation.type === "about_shout" &&
          <div className="ConversationItem-aboutShout">
            {about.title}
          </div>
        }

        <div className="ConversationItem-partecipants">
          { partecipants }
        </div>

        <div className="ConversationItem-lastMessage" title={ lastMessage.text }>
          { lastMessage.text }
        </div>

      </div>

      <div className="ConversationItem-createdAt">
        { formatCreatedAt(lastMessage.created_at) }
      </div>
    </Link>
  );
}
