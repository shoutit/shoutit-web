import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default function ConversationName({ conversation, link = true }) {
  const profiles = conversation.profiles.filter(profile => !profile.isOwner);

  if (link) {
    return (
      <span>
        {
          profiles.map((profile, i) => {
            return (
              <span>
                <Link key={ profile.username } to={ `/user/${profile.username}` }>{ profile.name }</Link>
                { i !== profiles.length - 1 && ', ' }
              </span>
            );
          })
        }
      </span>
    );
  }
  return (
    <span>
      { profiles.map(profile => profile.name).join(', ') }
    </span>
  );
}

ConversationName.propTypes = {
  link: PropTypes.bool,
  conversation: PropTypes.object,
};
