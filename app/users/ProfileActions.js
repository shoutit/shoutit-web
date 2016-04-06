import React, { PropTypes } from 'react';

import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

if (process.env.BROWSER) {
  require('./ProfileActions.scss');
}

export default function ProfileActions({ profile }) {
  return (
      <div className="ProfileActions">
        <ListItem start= { <SVGIcon name="listen" /> }>
          Listen
        </ListItem>
        <ListItem start= { <SVGIcon name="balloon-dots" /> }>
          Start chatting
        </ListItem>

    </div>
  );
}

ProfileActions.propTypes = {
  profile: PropTypes.object.isRequired,
};
