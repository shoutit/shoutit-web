import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import ProfileAvatar from '../users/ProfileAvatar.js';
import Icon from '../ui/Icon.js';
import { formatCreatedAt } from '../utils/DateUtils';
import ConversationName from '../chat/ConversationName';

if (process.env.BROWSER) {
  require('./ConversationItem.scss');
}

export default function ConversationItem({
  conversation,
  onClick,
  selected = false,
  unread = false,
}) {

  const { id, profiles, lastMessage, unreadMessagesCount } = conversation;

  const partecipants = profiles.filter(profile => !profile.isOwner);
  let className = 'ConversationItem';
  if (selected) {
    className = `${className} is-selected`;
  }
  if (unread) {
    className = `${className} is-unread`;
  }
  return (
    <Link onClick={ onClick } to={ `/messages/${id}` } className={ className }>
      <div className="ConversationItem-user-avatar">
        <ProfileAvatar user={ partecipants[0] } />
      </div>

      <div className="ConversationItem-body">

        <div className="ConversationItem-title">
          <ConversationName conversation={ conversation } link={ false } />
        </div>

        { conversation.type === 'about_shout' &&
          <div className="ConversationItem-about_shout">
            {conversation.about.title}
          </div>
        }

        { lastMessage &&
          <div className="ConversationItem-last-message" title={ lastMessage.text }>
            { lastMessage.profile && lastMessage.profile.isOwner && <Icon name="reply" size="small" /> }
            { lastMessage.text && <span>{ lastMessage.text }</span> }
            { !lastMessage.text && lastMessage.attachments && <span className="htmlAncillary">Sent an attachment</span> }
          </div>
        }
      </div>

      <div className="ConversationItem-tools">
        { lastMessage &&
          <div className="ConversationItem-created-at">
            { formatCreatedAt(lastMessage.createdAt) }
          </div>
        }
        { unreadMessagesCount > 0 &&
          <div className="ConversationItem-unread-count">
            { conversation.unreadMessagesCount } new
          </div>
        }
      </div>

    </Link>
  );
}

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  unread: PropTypes.bool,
};
