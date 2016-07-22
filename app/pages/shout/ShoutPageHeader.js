import React, { PropTypes } from 'react';

import TimeAgo from '../../widgets/TimeAgo';
import ProfileListItem from '../../users/ProfileListItem';

export default function ShoutPageHeader({ shout }) {
  return (
    <div className="ShoutPage-Header">
      <div className="ShoutPage-Header-profile">
        <ProfileListItem popover={ false } profile={ shout.profile } />
      </div>
      <div className="ShoutPage-Header-date">
        <TimeAgo date={ shout.datePublished } />
      </div>
    </div>
  );
}

ShoutPageHeader.propTypes = {
  shout: PropTypes.object.isRequired,
};
