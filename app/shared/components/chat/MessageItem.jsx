import React from 'react';
import { formatCreatedAt } from '../../../utils/DateUtils';

export default function MessageItem({ message }) {

  return (
    <div className="MessageItem">
      <p>
        { message.text }
      </p>
      <div className="MessageItem-createdAt">
        { formatCreatedAt(message.created_at) }
      </div>
    </div>
  );
}
