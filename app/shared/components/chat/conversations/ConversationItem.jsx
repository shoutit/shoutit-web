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
  const params = {
    shoutId: shout.id,
    location: shout.location.city,
    title: encodeURIComponent(shout.title.replace(/\s+/g, '-'))
  };

  return (
    <Link to="shout" params={ params }>
       {shout.title}
    </Link>
  )
}


export default function ConversationItem({ conversation, me }) {
  const { users, last_message: lastMessage } = conversation;

  const opponents = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <div>
      <ConversationImage me={ me } conversation={ conversation } />
      <ConversationAbout conversation={ conversation } />
      <p>{ opponents }</p>
      <p>
        { lastMessage.text }
      </p>
    </div>
  );
}
