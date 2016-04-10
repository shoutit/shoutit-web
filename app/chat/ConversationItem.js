import React from 'react';
import { Link } from 'react-router';

import UserAvatar from '../users/UserAvatar.js';
import { formatCreatedAt } from '../utils/DateUtils';
import { getConversationName } from './ChatUtils';

if (process.env.BROWSER) {
  require('./ConversationItem.scss');
}

export default function ConversationItem({ conversation, loggedUser, selected = false, unread = false, onClick }) {

  const { id, type, profiles, lastMessage, about } = conversation;

  const partecipants = profiles.filter(profile => profile.id !== loggedUser.id);
  let className = 'ConversationItem';
  if (selected) {
    className = `${className} is-selected`;
  }

  if (unread) {
    className = `${className} is-unread`;
  }

  return (
    <Link onClick={ onClick } to={ `/messages/${id}` } className={ className }>
      <div className="ConversationItem-usersImage">
        <UserAvatar user={ partecipants[0] } />
      </div>

      <div className="ConversationItem-body">

        <div className="ConversationItem-title">
          { getConversationName(conversation, loggedUser) }
        </div>
        {/*{ type === 'about_shout' &&
          <div className="ConversationItem-aboutShout">
            {about.title}
          </div>
        }

        <div className="ConversationItem-partecipants">
          { partecipants }
        </div>*/}

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
