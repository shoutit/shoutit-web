import React, { PropTypes } from 'react';
import { getVariation } from '../utils/APIUtils';
import ShoutPrice from './ShoutPrice';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import UserAvatar from '../users/UserAvatar';

if (process.env.BROWSER) {
  require('../ui/Card.scss');
  require('./ShoutPreview.scss');
}

export default function ShoutPreview({ shout }) {
  return (
    <ShoutLink className="Card ShoutPreview" shout={ shout }>
      <UserAvatar user={ shout.profile } />
      <ShoutPrice shout={ shout } />
      <div className="Card-image-wrapper">
        <div className="Card-image" style={{ backgroundImage: `url("${getVariation(shout.thumbnail, 'small')}")` }} />
      </div>
      <div className="Card-title">
        <div className="Card-title-max-height" title={shout.title}>
          { shout.title }
        </div>
        <div className="ShoutPreview-details">
          <TimeAgo date={ shout.datePublished } />
          { ' ' } in { ' ' }
          { shout.category.name || shout.category }
        </div>
      </div>
    </ShoutLink>
  );
}

ShoutPreview.propTypes = {
  shout: PropTypes.object.isRequired,
};
