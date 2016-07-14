import React, { PropTypes } from 'react';
import ListItem from '../layout/ListItem';
import CategoryIcon from '../shouts/CategoryIcon';

export default function CategoryListItem({ category, size = 'medium', onClick }) {
  return (
    <ListItem
      onClick={ onClick }
      className="CategoryListItem"
      size={ size }
      start={ <CategoryIcon size={ size } category={ category } size={ size } /> }
    >
      { category.name }
    </ListItem>
  );
}

CategoryListItem.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  category: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};
