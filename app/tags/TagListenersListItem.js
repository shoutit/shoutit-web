import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export default function TagListenersListItem({ tag, size = 'small' }) {
  const { listenersCount } = tag;
  return (
    <ListItem
      className="TagListenersListItem"
      size={ size }
      nowrap
      start={ <Icon name="listeners" active={ listenersCount > 0 } /> }>

      { listenersCount === 0 ? 'No ' : listenersCount } listener{ listenersCount > 1}s

    </ListItem>
  );
}

TagListenersListItem.propTypes = {
  tag: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};
