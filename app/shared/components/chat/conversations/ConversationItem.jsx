import React from 'react';
import {Col} from 'react-bootstrap';
import {Link} from 'react-router';
import classnames from 'classnames';

import ConversationImage from './conversationImage.jsx';

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

  const opponents = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div onClick={ onClick.bind(this, conversation.id) }>
      <ConversationImage me={ me } conversation={ conversation } />
      <ConversationAbout conversation={ conversation } />
      <p>{ opponents }</p>
      <p>
        <Link tabIndex={ -1 } to={ `/home/chat/${conversation.id}` } onClick={ e => e.stopPropagation() } >
          { lastMessage.text }
        </Link>
      </p>
      { selected && <p>Selected</p> }
    </div>
  );
}
