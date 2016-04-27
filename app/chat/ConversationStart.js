import React, { PropTypes } from 'react';
import ProfileAvatar from '../users/ProfileAvatar';
// import ShoutPreview from '../shouts/ShoutPreview';

if (process.env.BROWSER) {
  require('./ConversationStart.scss');
}

export default function ConversationStart({ conversation }) {

  const user = conversation ?
    conversation.profiles.filter(profile => !profile.isOwner)[0] :
    undefined;

  return (
    <div className="ConversationStart">
      { conversation.type === 'chat' ?
        <div className="ConversationStart-chat">
          <ProfileAvatar user={ user } size="large" style={ { marginBottom: '1rem' } } />
          <p className="htmlAncillary">
            To start chatting, write { user.firstName } a message.
          </p>
        </div>
        :
        <div className="ConversationStart-shout">
          {/* <ShoutPreview shout={ conversation.about } />*/}
          <p className="htmlAncillary">
            If you are interested in this, write { user.firstName } a message.
          </p>
        </div>
      }

    </div>
  );
}

ConversationStart.propTypes = {
  conversation: PropTypes.object.isRequired,
};
