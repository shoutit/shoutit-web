import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import Tooltip from '../ui/Tooltip';
import TagPreview from '../tags/TagPreview';

export function TagListItem({ tag, size = 'medium', tooltipPlacement = 'right' }) {

  const overlay = <TagPreview id={ tag.id } />;
  let icon;
  if (tag.icon) {
    icon = <img src={ tag.icon } width="18" />;
  } else {
    icon = <Icon size={ size } name="tag" active />;
  }
  return (
    <Tooltip
      white
      placement={ tooltipPlacement }
      overlay={ overlay }
      getTooltipContainer={ c => c.parentNode }>
      <Link className="TagListItem" to={ `/interest/${tag.slug || tag.name}` }>
        <ListItem size={size} nowrap start={ icon }>
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

const mapStateToProps = (state, ownProps) => {
  let tag = ownProps.tag;
  if (state.entities.categories[ownProps.tag.name]) {
    tag = {
      ...ownProps.tag,
      ...state.entities.categories[ownProps.tag.name],
    };
  }
  return { tag };
};
export default connect(mapStateToProps)(TagListItem);
