import React from 'react';
import { Link } from 'react-router';

import ManyUsersAvatar from '../users/ManyUsersAvatar.js';
import { formatCreatedAt } from '../utils/DateUtils';

if (process.env.BROWSER) {
  require('./ConversationItem.scss');
}

export default function ConversationItem({ conversation, me, selected = false, unread = false, onClick }) {

  const { id, type, profiles, lastMessage, about } = conversation;

  const partecipants = profiles
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  let className = 'ConversationItem';

  if (selected) {
    className = `${className} isSelected`;
  }

  if (unread) {
    className = `${className} isUnread`;
  }

  return (
    <Link onClick={ onClick } to={ `/messages/${id}` } className={ className }>
      <div className="ConversationItem-usersImage">
        <ManyUsersAvatar users={ profiles.filter(profile => profile.username !== me) } />
      </div>

      <div className="ConversationItem-body">

        { type === 'about_shout' &&
          <div className="ConversationItem-aboutShout">
            {about.title}
          </div>
        }

        <div className="ConversationItem-partecipants">
          { partecipants }
        </div>

        { lastMessage &&
          <div className="ConversationItem-lastMessage" title={ lastMessage.text }>
            { lastMessage.text }
          </div>
        }
      </div>

      { lastMessage &&
        <div className="ConversationItem-createdAt">
          { formatCreatedAt(lastMessage.createdAt) }
        </div>
      }
    </Link>
  );
}
