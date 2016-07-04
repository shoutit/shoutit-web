import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ListItem from '../layout/ListItem';
import './FilterListItem.scss';

export default function FilterListItem({ category, filter, size = 'medium' }) {
  return (
    <ListItem
      className="FilterListItem"
      size={ size }
      start={ filter.name }
    >
      <Link to={ `/search?category=${category.slug}&filters=${filter.slug}:${filter.value.slug}` }>
        { filter.value.name }
      </Link>
    </ListItem>
  );
}

FilterListItem.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  filter: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
};
