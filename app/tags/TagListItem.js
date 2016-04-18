import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import Tooltip from '../ui/Tooltip';
import TagPreview from '../tags/TagPreview';
export default function TagListItem({ tag, size = 'medium', tooltipPlacement = 'right' }) {

  const overlay = <TagPreview id={ tag.id } />;

  return (
    <Tooltip
      white
      placement={ tooltipPlacement }
      overlay={ overlay }
      getTooltipContainer={ c => c.parentNode }>
    <Link className="TagListItem" to={ `/interest/${tag.name}` }>
      <ListItem size={size} nowrap start={ <Icon size={ size } name="tag" active /> }>
        { tag.name }
      </ListItem>
    </Link>
    </Tooltip>
  );
}

TagListItem.propTypes = {
  tag: PropTypes.object.isRequired,
  tooltipPlacement: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'small']),
};
