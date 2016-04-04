import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import UserAvatar from '../users/UserAvatar';
import Tooltip from '../ui/Tooltip';
import ProfileOverlay from '../users/ProfileOverlay';

if (process.env.BROWSER) {
  require('./ProfileListItem.scss');
}
export default function ProfileListItem({ profile }) {
  return (
    <Tooltip
      destroyTooltipOnHide
      mouseLeaveDelay={0.05}
      white
      placement="right"
      overlay={ <ProfileOverlay id={ profile.id } /> }
      getTooltipContainer={ c => c.parentNode }
    >
      <Link className="ProfileListItem" to={ `/user/${profile.username}` }>
        <UserAvatar size="small" user={ profile } />{ profile.name }
      </Link>
    </Tooltip>
  );
}

ProfileListItem.PropTypes = {
  profile: PropTypes.object.isRequired,
};
