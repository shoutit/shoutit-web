import React from 'react';

/**
 * Component being displayed as index in the chat container.
 * @param {Boolean} props.loading
 * @param {Array}   props.conversations
 */
export default function MessageListIndex({ loading=false, conversations=[] }) {
  return (
    <div>
      { loading
        ? <p>Loading...</p>
        : conversations.length === 0 ? <p>No conversations!</p>
        : <p>Pick a message from the left</p>
      }
    </div>
  )
}
