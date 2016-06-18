import React, { PropTypes } from 'react';
import ShoutListItem from '../shouts/ShoutListItem';

if (process.env.BROWSER) {
  require('./ConversationHead.scss');
}

export default function ConversationHead({ conversation, showTitle = true }) {
  if (!showTitle && !conversation.about) {
    return null;
  }
  return (
    <div className="ConversationHead">
    { conversation.about &&
      <div className="ConversationHead-about">
        <ShoutListItem shout={ conversation.about } />
      </div>
    }

    { showTitle &&
      <div className="ConversationHead-title">
        { conversation.display.title || conversation.display.subTitle }
      </div>
      }
    </div>
  );
}

ConversationHead.propTypes = {
  conversation: PropTypes.object.isRequired,
  showTitle: PropTypes.bool,
};
