import React from 'react';

export default function MessageItem({ message }) {

  return (
    <div className="MessageItem">
      <p>
        { message.text }
      </p>
    </div>
  );
}
