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
  disabled = false,
  onClick,
}) {
  let cssClass = `${className} ListItem size-${size}`;
  if (nowrap) {
    cssClass += ' nowrap';
  }
  if (onClick) {
    cssClass += ' interaction-enabled';
  }
  if (disabled) {
    cssClass += ' disabled';
  }
  return (
    <div
      className={ cssClass }
      onClick={ onClick ? e => { e.currentTarget.blur(); onClick(e); } : null }
      tabIndex={ onClick && !disabled ? 0 : -1 }
    >
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
