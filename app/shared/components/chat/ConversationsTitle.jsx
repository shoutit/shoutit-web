import React from 'react';
import { Link } from 'react-router';

export default function ConversationsTitle({ unreadCount }) {
  return (
    <div className="ConversationsTitle">
      <Link to="/chat">
        Inbox { unreadCount > 0 ? `(${unreadCount} unread)` : '' }
      </Link>
    </div>
  );
}
