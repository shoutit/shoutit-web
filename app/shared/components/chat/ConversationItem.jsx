import React from 'react';
import {Link} from 'react-router';

import ManyUsersImage from '../user/ManyUsersImage.jsx';
import { formatCreatedAt } from '../../../utils/DateUtils';

export default function ConversationItem({ conversation, me, selected }) {
  const { users, last_message: lastMessage, about } = conversation;

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div className={ `ConversationItem${selected ? ' isSelected' : ''} `}>

        <div className="ConversationItem-usersImage">
          <ManyUsersImage users={ users.filter(user => user.username !== me) } />
        </div>

        <div className="ConversationItem-body">

          { conversation.type === 'about_shout' &&
            <div className="ConversationItem-aboutShout">
              {about.title}
            </div>
          }

          <div className="ConversationItem-partecipants">
            { partecipants }
          </div>

          <div className="ConversationItem-lastMessage">
            <Link to={ `/chat/${conversation.id}` } onClick={ e => e.stopPropagation() } >
              { lastMessage.text }
            </Link>
          </div>

        </div>

        <div className="ConversationItem-createdAt">
          { formatCreatedAt(lastMessage.created_at) }
        </div>
    </div>
  );
}
