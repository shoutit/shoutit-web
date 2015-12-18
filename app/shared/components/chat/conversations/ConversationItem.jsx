import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import ManyUsersImage from '../../user/ManyUsersImage.jsx';

function ConversationAbout({ conversation }) {
  if (conversation.type !== 'about_shout') {
    // Nothing to show for now
    return <span />;
  }
  const { about: shout } = conversation;

  return (
    <Link to={ `/shout/${shout.id}/${shout.location.city}/${shout.title}` }
      onClick={ e => e.stopPropagation() }>
      {shout.title}
    </Link>
  )
}

export default function ConversationItem({ conversation, me, selected, onClick }) {
  const { users, last_message: lastMessage } = conversation;

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div onClick={ onClick.bind(this, conversation.id) }>
      <ManyUsersImage users={ users.filter(user => user.username !== me) } />
      <ConversationAbout conversation={ conversation } />
      <p>{ partecipants }</p>
      <p>
        <Link tabIndex={ -1 } to={ `/chat/${conversation.id}` } onClick={ e => e.stopPropagation() } >
          { lastMessage.text }
        </Link>
      </p>
      { selected && <p>Selected</p> }
      <p>
        { moment.unix(lastMessage.created_at).calendar() }
      </p>
    </div>
  );
}
