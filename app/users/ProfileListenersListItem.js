import React, { PropTypes } from 'react';
import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

export default function ProfileListenersListItem({ profile, size = 'small' }) {
  const { listenersCount } = profile;
  return (
    <ListItem
      className="ProfileListenersListItem"
      size={ size }
      nowrap
      start={ <SVGIcon name="listeners" active={ listenersCount > 0 } /> }
    >
     { listenersCount === 0 ? 'No ' : listenersCount } listener{ listenersCount > 1}s
    </ListItem>
  );
}

ProfileListenersListItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
