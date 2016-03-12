import React from "react";
import { Link } from "react-router";

import SVGIcon from "../shared/components/helper/SVGIcon";
import Button from "../shared/components/helper/Button";

if (process.env.BROWSER) {
  require("./ConversationTitle.scss");
}

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function ConversationTitle({ users, about, type, me, showVideoCallButton=false, onDeleteConversationClick, onVideoCallClick }) {
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
        { showVideoCallButton &&
            <Button primary size="small"  label="Video call" onClick={ onVideoCallClick } leftIcon={ <SVGIcon fill name="video" /> } />
        }
        <SVGIcon name="trash" hover onClick={ onDeleteConversationClick } />
      </div>
    </div>
  );
}
