import React from "react";
import { Link } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/ConversationsTitle.scss");
}

export default function ConversationsTitle({ unreadCount }) {
  return (
    <div className="ConversationsTitle">
      <Link to="/messages">
        Conversations { unreadCount > 0 ? `(${unreadCount} unread)` : "" }
      </Link>
    </div>
  );
}
