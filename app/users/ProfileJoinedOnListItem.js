import React, { PropTypes } from 'react';
import { toDate } from 'unix-timestamp';
import { FormattedDate, FormattedMessage } from 'react-intl';

import ListItem from '../layout/ListItem';
import Icon from '../widgets/Icon';

export default function ProfileJoinedOnListItem({ profile, size = 'medium' }) {
  return (
    <ListItem
      className="ProfileJoinedOnListItem"
      size={ size }
      start={ <Icon name="clock" active size={ size } /> }
    >
      <FormattedMessage
        id="profileJoined.text"
        defaultMessage="Joined on {date}"
        values={ {
          date: <FormattedDate
            value={ toDate(profile.dateJoined) }
            year="numeric"
            month="short"
            day="numeric" />,
        } }
      />
    </ListItem>
  );
}

ProfileJoinedOnListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
