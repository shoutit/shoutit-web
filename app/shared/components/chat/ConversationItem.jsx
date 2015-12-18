import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import ManyUsersImage from '../user/ManyUsersImage.jsx';

export default function ConversationItem({ conversation, me, selected, onClick }) {
  const { users, last_message: lastMessage, about } = conversation;

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div
      className={ `ConversationItem${selected ? ' isSelected' : ''} `}
      onClick={ onClick.bind(this, conversation.id) }>

      <ManyUsersImage users={ users.filter(user => user.username !== me) } />

      { conversation.type === 'about_shout' &&
        <p className="ConversationItem-about">
          <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }
            onClick={ e => e.stopPropagation() }>
            {about.title}
          </Link>
        </p>
      }

      <div className="ConversationItem-partecipants">{ partecipants }</div>

      <p className="ConversationItem-lastMessage">
        <Link tabIndex={ -1 } to={ `/chat/${conversation.id}` } onClick={ e => e.stopPropagation() } >
          { lastMessage.text }
        </Link>
      </p>

      <p className="ConversationItem-createdAt">
        { moment.unix(lastMessage.created_at).calendar() }
      </p>

    </div>
  );
}
