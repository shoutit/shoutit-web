import React from 'react';
import { Link } from 'react-router';

import Button from '../ui/Button';
import VideocallButton from "../videoCalls/VideocallButton"

if (process.env.BROWSER) {
  require('./ConversationTitle.scss');
}

/**
 * Show the title for a list of messages.
 *
 * @param {Object} props.conversation
 * @param {String} props.me
 */
export default function ConversationTitle({ conversation, me, showVideoCallButton = false, onDeleteConversationClick }) {
  const { about, users } = conversation;

  const partecipants = users.filter(user => user.username !== me);

  return (
    <div className="ConversationTitle">
      <div className="ConversationTitle-content">
      { conversation.type === 'about_shout' &&
        <div className="ConversationTitle-aboutShout">
          <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }>
          {about.title}
          </Link>
        </div>
        }
        <div className="ConversationTitle-partecipants">
        { partecipants.map(user => user.name).join(', ') }
        </div>
      </div>
      <div className="ConversationTitle-toolbar">
        {/* <VideocallButton user={ partecipants[0] } /> */}
        <Button label="Leave" size="small" abel="Video call" onClick={ onDeleteConversationClick } />
      </div>
    </div>
  );
}
