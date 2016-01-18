import React from "react";
import { Link } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/ConversationTitle.scss");
}

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function ConversationTitle({ users, about, type, me }) {
  const partecipants = users.filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  return (
    <div className="ConversationTitle">
      { type === "about_shout" &&
        <div className="ConversationTitle-aboutShout">
          <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }>
            {about.title}
          </Link>
        </div>
      }
      <div className="ConversationTitle-partecipants">
        { partecipants }
       </div>
    </div>
  );
}
