import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import Tooltip from '../ui/Tooltip';
import TagPreview from '../tags/TagPreview';

export function TagListItem({ tag, size = 'medium', tooltipPlacement = 'right', link = true }) {

  const overlay = <TagPreview id={ tag.id } />;
  let icon;
  if (tag.icon) {
    icon = <img alt="Icon" src={ tag.icon } style={ { width: '1.3em', verticalAlign: 'middle' } } />;
  } else {
    icon = <Icon size={ size } name="tag" active />;
  }

  const item = (
    <ListItem className="TagListItem" size={ size } nowrap start={ icon }>
      { tag.name }
    </ListItem>
  );
  return (
    <Tooltip
      white
      placement={ tooltipPlacement }
      overlay={ overlay }
      getTooltipContainer={ c => c.parentNode }>
      { link ?
        <Link to={ `/interest/${tag.slug || tag.name}` }>
          { item }
        </Link>
        : item
      }
    </Tooltip>
  );
}

TagListItem.propTypes = {
  link: PropTypes.bool,
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
