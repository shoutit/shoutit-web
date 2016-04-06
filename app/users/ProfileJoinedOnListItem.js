import React, { PropTypes } from 'react';
import moment from 'moment';

import ListItem from '../ui/ListItem';
import SVGIcon from '../ui/SVGIcon';

export default function ProfileJoinedOnListItem({ profile, size = 'medium' }) {
  return (
    <ListItem
      className="ProfileJoinedOnListItem"
      size={ size }
      start={ <SVGIcon name="clock" active size={ size } /> }
    >
      Joined on { moment.unix(profile.dateJoined).format('ll') }
    </ListItem>
  );
}

ProfileJoinedOnListItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
