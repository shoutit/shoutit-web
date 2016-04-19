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
      tabIndex={ onClick && !disabled ? 0 : null }
    >
      { start && <span className="ListItem-start">
        { start }
      </span>
      }
      { children && <span className="ListItem-end">
        { children }
      </span>
      }
    </div>
  );
}

ListItem.propTypes = {
  className: PropTypes.string,
  start: PropTypes.element,
  nowrap: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
