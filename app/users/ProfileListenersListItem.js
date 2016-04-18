import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export default function ProfileListenersListItem({ profile, size = 'small' }) {
  const { listenersCount } = profile;
  return (
    <ListItem
      className="ProfileListenersListItem"
      size={ size }
      nowrap
      start={ <Icon name="listeners" active={ listenersCount > 0 } /> }
    >
     { listenersCount === 0 ? 'No ' : listenersCount } listener{ listenersCount > 1}s
    </ListItem>
  );
}

ProfileListenersListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};
