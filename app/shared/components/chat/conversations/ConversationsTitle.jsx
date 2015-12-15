import React from 'react';

export default function ConversationsTitle({ unreadCount }) {
  return (
    <div className="title-chat">
      <h4>Inbox { unreadCount > 0 ? `(${unreadCount} unread)` : '' }</h4>
    </div>
  );
}
