import React, { PropTypes } from 'react';
import moment from 'moment';

import ListItem from '../ui/ListItem';
import Icon from '../ui/Icon';

export default function ProfileJoinedOnListItem({ profile, size = 'medium' }) {
  return (
    <ListItem
      className="ProfileJoinedOnListItem"
      size={ size }
      start={ <Icon name="clock" active size={ size } /> }
    >
      Joined on { moment.unix(profile.dateJoined).format('ll') }
    </ListItem>
  );
}

ProfileJoinedOnListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
