import React, { PropTypes } from 'react';
import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

export default function ProfileListening({ profile, size = 'small' }) {
  const { listeningCount } = profile;
  return (
    <ListItem
      className="ProfileListening"
      size={ size }
      nowrap
      start={ <SVGIcon name="listening" active={ listeningCount.users > 0 } /> }
    >
     { listeningCount.users === 0 ? 'Not listening' : `${listeningCount.users} listening` } 
    </ListItem>
  );
}

ProfileListening.propTypes = {
  profile: PropTypes.object.isRequired,
};
