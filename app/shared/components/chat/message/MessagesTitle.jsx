import React from 'react';

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
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
