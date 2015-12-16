import React from 'react';

export default function MessageListIndex({ loading, conversations }) {
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
