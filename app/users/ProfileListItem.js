import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import UserAvatar from '../users/UserAvatar';

if (process.env.BROWSER) {
  require('./ProfileListItem.scss');
}
export default function ProfileListItem({ profile }) {
  return (
    <Link className="ProfileListItem" to={ `/users/${profile.username}` }>
      <UserAvatar size="small" user={ profile } /> { profile.username }
    </Link>
  );
}

ProfileListItem.PropTypes = {
  profile: PropTypes.object.isRequired,
};
