import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./ListItem.scss');
}

export default function ListItem({
  className = '',
  start,
  children,
  size = 'medium',
  nowrap = false,
  onClick,
}) {
  let cssClass = `${className} ListItem size-${size}`;
  if (nowrap) {
    cssClass += ' nowrap';
  }
  if (onClick) {
    cssClass += ' interaction-enabled';
  }
  return (
    <div className={ cssClass } onClick={ onClick }>
      { start && <span className="ListItem-start">
        { start }
      </span>
      }
      <span className="ListItem-end">
        { children }
      </span>
    </div>
  );
}

ListItem.PropTypes = {
  start: PropTypes.element,
  childen: PropTypes.element.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
