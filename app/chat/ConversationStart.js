import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import ProfileAvatar from '../users/ProfileAvatar';

import './ConversationStart.scss';

export default function ConversationStart({ conversation }) {

  const profile = conversation ?
    conversation.profiles.filter(profile => !profile.isOwner)[0] :
    undefined;

  return (
    <div className="ConversationStart">
      { conversation.type === 'chat' ?
        <div className="ConversationStart-chat">
          <ProfileAvatar profile={ profile } size="large" style={ { marginBottom: '1rem' } } />
          <p className="htmlAncillary">
            <FormattedMessage
              id="chat.newConversation.welcome"
              defaultMessage="To start chatting, write {firstName} a message."
              values={ { firstName: profile.firstName } }
            />
          </p>
        </div>
        :
        <div className="ConversationStart-shout">
          <p className="htmlAncillary">
            <FormattedMessage
              id="chat.replyForm.welcome"
              defaultMessage="To start chatting about this Shout, write {firstName} a message."
              values={ { firstName: profile.firstName } }
            />
          </p>
        </div>
      }

    </div>
  );
}

ConversationStart.propTypes = {
  conversation: PropTypes.object.isRequired,
};
