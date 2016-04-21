import React, { PropTypes } from 'react';
import ShoutLink from '../shouts/ShoutLink';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./ConversationAbout.scss');
}

export default function ConversationAbout({ shout }) {
  const { thumbnail, title, description } = shout;
  return (
    <ShoutLink shout={ shout } className="ConversationAbout">
      { thumbnail &&
        <span className="ConversationAbout-image" style={ getStyleBackgroundImage(thumbnail, 'small') } />
      }
      <span className="ConversationAbout-title">
        { title || (description && description.substring(0, 160)) || 'About a shout without content' }
      </span>
    </ShoutLink>
  );
}

ConversationAbout.propTypes = {
  shout: PropTypes.object.isRequired,
};
