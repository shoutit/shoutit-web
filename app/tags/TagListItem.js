import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import Popover from '../widgets/Popover';
import TagPreview from '../tags/TagPreview';
import CategoryIcon from '../shouts/CategoryIcon';

export function TagListItem({ tag, size = 'medium', link = true, category, popover = true, onClick }) {

  let icon;
  if (category) {
    icon = <CategoryIcon category={ category } size={ size } />;
  } else {
    icon = <Icon size={ size } name="tag" active />;
  }
  const item = (
    <ListItem className="TagListItem" size={ size } nowrap start={ icon } onClick={ onClick }>
      { category ? category.name : tag.name }
    </ListItem>
  );

  let content = link ?
    <Link to={ `/interest/${tag.slug}` }>
      { item }
    </Link>
    : item;

  if (popover) {
    const overlay = <TagPreview id={ tag.id } />;
    content = (
      <Popover overlay={ overlay } placement="right">
        { content }
      </Popover>
    );
  }

  return content;

}

TagListItem.propTypes = {
  link: PropTypes.bool,
  tag: PropTypes.object.isRequired,
  category: PropTypes.object,
  onClick: PropTypes.func,
  tooltipPlacement: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'small']),
};


const mapStateToProps = (state, ownProps) => {
  const { tag } = ownProps;
  const category = state.entities.categories[tag.slug];
  return {
    tag,
    category,
  };
};

export default connect(mapStateToProps)(TagListItem);
