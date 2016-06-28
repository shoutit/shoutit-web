import React, { PropTypes } from 'react';

import './CategoryIcon.scss';
export default function CategoryIcon({ category, size = 'medium' }) {
  const style = {
    backgroundImage: `url("${category.icon}")`,
  };
  const className = `CategoryIcon size-${size}`;
  return (
    <span className={ className } style={ style } />
  );
}

CategoryIcon.propTypes = {
  category: PropTypes.object.isRequired,
  size: PropTypes.string,
};
