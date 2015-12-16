import React from 'react';

export default function MessagesTitle({ conversation, me }) {

  const opponents = conversation.users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div className="chat-right-title">
      <p className="chat-name">{ opponents }</p>
    </div>
  )
}
