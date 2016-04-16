import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

if (process.env.BROWSER) {
  // require('./CategoryListItem.scss');
}

export default function CategoryListItem({ category, size = 'medium', onClick }) {
  return (
    <ListItem
      onClick={ onClick }
      className="CategoryListItem"
      size={ size }
      start={ <Icon size={ size } name="tag" /> }
    >
      { category.name || category }
    </ListItem>
  );
}

CategoryListItem.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  category: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};
