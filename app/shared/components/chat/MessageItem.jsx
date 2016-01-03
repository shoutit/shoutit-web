import React from 'react';
import { formatCreatedAt } from '../../../utils/DateUtils';

export default function MessageItem({ message, justify='start' }) {

  return (
    <div className={ `MessageItem ${justify}`}>
      <div className="MessageItem-wrapper">
        <div>
          { message.text }
        </div>
        <div className="MessageItem-createdAt">
          { formatCreatedAt(message.created_at) }
        </div>
      </div>
    </div>
  );
}
