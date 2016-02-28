import React from "react";
import { Link } from "react-router";

import SVGIcon from "../helper/SVGIcon";

if (process.env.BROWSER) {
  require("styles/components/ConversationTitle.scss");
}

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function ConversationTitle({ users, about, type, me, onDeleteConversationClick, onVideoCallClick }) {
  const partecipants = users.filter(user => user.username !== me)
    .map(user => user.name)
    .join(", ");

  return (
    <div className="ConversationTitle">
      <div className="ConversationTitle-content">
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
      <div className="ConversationTitle-toolbar">
        <SVGIcon name="video" hover onClick={ onVideoCallClick } />
        <SVGIcon name="trash" hover onClick={ onDeleteConversationClick } />
      </div>
    </div>
  );
}
