import React from "react";
import {Link} from "react-router";

import ManyUsersImage from "../user/ManyUsersImage.jsx";
import { formatCreatedAt } from "../../../utils/DateUtils";

export default function ConversationItem({ id, type, users, last_message, about, me, selected }) {

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  return (
    <Link to={ `/chat/${id}` } className={ `ConversationItem${selected ? " isSelected" : ""} `}>
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

        <div className="ConversationItem-lastMessage" title={ last_message.text }>
          { last_message.text }
        </div>

      </div>

      <div className="ConversationItem-createdAt">
        { formatCreatedAt(last_message.created_at) }
      </div>
    </Link>
  );
}
