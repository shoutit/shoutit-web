import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export default function TagListItem({ tag, size = 'medium' }) {
  return (
    <Link className="TagListItem" to={ `/interest/${tag.name}` }>
      <ListItem size={size} nowrap start={ <Icon size={ size } name="tag" active /> }>
        { tag.name }
      </ListItem>
    </Link>
  );
}

TagListItem.propTypes = {
  tag: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['medium', 'small']),
};
