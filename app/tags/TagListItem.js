import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import Popover from '../ui/Popover';
import TagPreview from '../tags/TagPreview';
import CategoryIcon from '../shouts/CategoryIcon';

export function TagListItem({ tag, size = 'medium', link = true, category }) {

  const overlay = <TagPreview id={ tag.id } />;
  let icon;
  if (category) {
    icon = <CategoryIcon category={ category } size={ size } />;
  } else {
    icon = <Icon size={ size } name="tag" active />;
  }
  const item = (
    <ListItem className="TagListItem" size={ size } nowrap start={ icon }>
      { category ? category.name : tag.name }
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
  category: PropTypes.object,
  tooltipPlacement: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'small']),
};


const mapStateToProps = (state, ownProps) => {
  const { tag } = ownProps;
  const category = state.entities.categories[tag.name];
  return {
    tag,
    category,
  };
};

export default connect(mapStateToProps)(TagListItem);
