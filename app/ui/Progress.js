import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Progress.scss');
}

export default function Progress({ label = 'Loading…', animate = false, spaced = true, style, size }) {
  let className = 'Progress';
  if (animate) {
    className += ' animated';
  }
  if (!spaced) {
    className += ' no-space';
  }
  if (size) {
    className += ` size-${size}`;
  }
  return (
    <div className={ className } style={ style }>
      <div className="Progress-wrapper">
        <div className="Progress-label">
          <div className="Progress-animation" />
          { label }
        </div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  label: PropTypes.string,
  animate: PropTypes.bool,
  spaced: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.oneOf(['small']),
};
