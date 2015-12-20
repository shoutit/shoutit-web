import React from 'react';
import { Link } from 'react-router';
/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function MessagesTitle({ conversation, me }) {
  const { about } = conversation;
  const partecipants = conversation.users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div className="MessagesTitle">
      { conversation.type === 'about_shout' &&
        <div className="MessagesTitle-aboutShout">
          <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }
            onClick={ e => e.stopPropagation() }>
            {about.title}
          </Link>
        </div>
      }
      <div className="MessagesTitle-partecipants">
        { partecipants }
       </div>
    </div>
  )
}
