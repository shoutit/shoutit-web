import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export default function ProfileListening({ profile, size = 'small' }) {
  const { listeningCount } = profile;
  return (
    <ListItem
      className="ProfileListening"
      size={ size }
      nowrap
      start={ <Icon name="listening" size={ size } active={ listeningCount.users > 0 } /> }>

      { listeningCount.users === 0 ? 'Not listening' : `${listeningCount.users} listening` }

    </ListItem>
  );
}

ProfileListening.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};
