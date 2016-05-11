import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import Popover from '../ui/Popover';
import TagPreview from '../tags/TagPreview';

export default function TagListItem({ tag, size = 'medium', link = true }) {

  const overlay = <TagPreview id={ tag.id } />;
  const item = (
    <ListItem className="TagListItem" size={ size } nowrap start={ <Icon size={ size } name="tag" active /> }>
      { tag.name }
    </ListItem>
  );
  return (
    <Popover overlay={ overlay } placement="right">
      { link ?
        <Link to={ `/interest/${tag.slug || tag.name}` }>
          { item }
        </Link>
        : item
      }
    </Popover>
  );
}

TagListItem.propTypes = {
  link: PropTypes.bool,
  tag: PropTypes.object.isRequired,
  tooltipPlacement: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'small']),
};
