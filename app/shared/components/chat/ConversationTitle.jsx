import React from "react";
import { Link } from "react-router";

import IconMenu from "material-ui/lib/menus/icon-menu";
import MenuItem from "material-ui/lib/menus/menu-item";
import IconButton from "material-ui/lib/icon-button";
import { NavigationMoreVert } from "material-ui/lib/svg-icons";

if (process.env.BROWSER) {
  require("styles/components/ConversationTitle.scss");
}

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function ConversationTitle({ users, about, type, me, onDeleteConversationTouchTap, onDeleteMessagesTouchTap }) {
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
        <IconMenu
          anchorOrigin={{horizontal: "right", vertical: "top" }}
          iconButtonElement={
          <IconButton><NavigationMoreVert /></IconButton>
          }
        >
          <MenuItem primaryText="Delete conversation…"
            onTouchTap={ onDeleteConversationTouchTap } />
          <MenuItem primaryText="Delete messages…"
            onTouchTap={ onDeleteMessagesTouchTap } />
        </IconMenu>
      </div>
    </div>
  );
}
