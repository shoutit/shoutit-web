import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./CategoryIcon.scss');
}
export default function CategoryIcon({ category, size = 'medium' }) {
  const style = {
    backgroundImage: `url("${category.icon}")`,
  };
  let className = `CategoryIcon size-${size}`;
  return (
    <span className={ className } style={ style } />
  );
}

CategoryIcon.propTypes = {
  category: PropTypes.object.isRequired,
  size: PropTypes.string,
};
