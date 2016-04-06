import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import UserAvatar from '../users/UserAvatar';
import Tooltip from '../ui/Tooltip';
import ListItem from '../ui/ListItem';
import ProfileOverlay from '../users/ProfileOverlay';

export default function ProfileListItem({ profile, size = 'medium' }) {
  return (
    <Tooltip
      destroyTooltipOnHide
      white
      placement="right"
      overlay={ <ProfileOverlay id={ profile.id } /> }
      getTooltipContainer={ c => c }
    >
      <Link className="ProfileListItem" to={ `/user/${profile.username}` }>
        <ListItem
          size={ size }
          nowrap
          start={<UserAvatar size={ size } user={ profile } />
        }>
          { profile.name }
        </ListItem>
      </Link>
    </Tooltip>
  );
}

ProfileListItem.PropTypes = {
  profile: PropTypes.object.isRequired,
};
