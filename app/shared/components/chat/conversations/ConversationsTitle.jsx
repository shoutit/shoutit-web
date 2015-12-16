import React from 'react';
import {Link} from 'react-router';

export default function ConversationsTitle({ unreadCount }) {
  return (
    <div className="title-chat">
      <h4>
        <Link to="/home/chat">
          Inbox { unreadCount > 0 ? `(${unreadCount} unread)` : '' }
        </Link>
      </h4>
    </div>
  );
}
