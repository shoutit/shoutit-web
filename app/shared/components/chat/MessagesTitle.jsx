import React from "react";
import { Link } from "react-router";
/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function MessagesTitle({ users, about, type, me }) {
  const partecipants = users.filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  return (
    <div className="MessagesTitle">
      { type === "about_shout" &&
        <div className="MessagesTitle-aboutShout">
          <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }>
            {about.title}
          </Link>
        </div>
      }
      <div className="MessagesTitle-partecipants">
        { partecipants }
       </div>
    </div>
  );
}
