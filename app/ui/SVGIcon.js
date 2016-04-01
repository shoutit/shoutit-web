import React from 'react';

if (process.env.BROWSER) {
  require('./SVGIcon.scss');
}

export default function SVGIcon({
  name,
  active = false,
  disabled = false,
  on = false,
  fill = false,
  size = 'medium',
  badge,
  hover = false,
  ...props,
}) {
  let className = `SVGIcon ${size}`;

  if (active) {
    className += ' active';
  }
  if (on) {
    className += ' on';
  }
  if (fill) {
    className += ' fill';
  }
  if (hover) {
    className += ' hover';
  }
  if (disabled) {
    className += ' disabled';
  }

  let badgeEl;
  if (typeof badge !== 'undefined') {
    // Set visibility hidden to leave the space once the badge get a value
    badgeEl = (
      <span className={ `SVGIcon-badge ${badge === 0 ? ' isHidden' : ''}` }>
        { badge }
      </span>
    );
  }

  const style = { ...props.style };
  if (props.onClick) {
    style.cursor = 'pointer';
  }

  return (
    <span { ...props } style={ style } className={ className } >
      <span className={ `SVGIcon-icon ${name}` } />
      { badgeEl }
    </span>

  );
}
