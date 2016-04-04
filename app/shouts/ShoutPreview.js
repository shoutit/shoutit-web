import React, { PropTypes } from 'react';
import { getVariation } from '../utils/APIUtils';
import ShoutPrice from './ShoutPrice';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import SVGIcon from '../ui/SVGIcon';

import UserAvatar from '../users/UserAvatar';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('rc-tooltip/assets/bootstrap.css');
  require('../ui/Card.scss');
  require('./ShoutPreview.scss');
}

export default function ShoutPreview({ shout }) {
  return (
    <ShoutLink className="Card ShoutPreview" shout={ shout }>
      <ShoutPrice shout={ shout } />
      <div className="Card-image-wrapper">
        <div className="Card-image" style={ getStyleBackgroundImage(shout.thumbnail) } />
      </div>
      <div className="Card-title">
        { shout.title && <div className="Card-title-max-height ShoutPreview-title" title={shout.title}>
          { shout.title }
        </div> }
        <div className="ShoutPreview-details">
          <UserAvatar user={ shout.profile } size="smallest" />
          <TimeAgo date={ shout.datePublished } />
          <span className="ShoutPreview-category">
            <SVGIcon size="small" name="tag" />
            { shout.category.name || shout.category }
          </span>
        </div>
      </div>
    </ShoutLink>
  );
}

ShoutPreview.propTypes = {
  shout: PropTypes.object.isRequired,
};
