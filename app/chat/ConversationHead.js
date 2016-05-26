import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ShoutListItem from '../shouts/ShoutListItem';

if (process.env.BROWSER) {
  require('./ConversationHead.scss');
}

export default function ConversationHead({ conversation, showTitle = true }) {
  const profiles = conversation.profiles.filter(profile => !profile.isOwner);
  showTitle = showTitle && (profiles.length > 0 || conversation.display.title);
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
        {
          profiles.length > 0 && profiles.map((profile, i) => {
            return (
              <span key={ profile.username } >
                <Link to={ `/user/${profile.username}` }>{ profile.name }</Link>
                { i !== profiles.length - 1 && ', ' }
              </span>
            );
          })
        }

        { profiles.length === 0 && conversation.display.title }

      </div>
      }
    </div>
  );
}

ConversationHead.propTypes = {
  conversation: PropTypes.object.isRequired,
  showTitle: PropTypes.bool,
};
