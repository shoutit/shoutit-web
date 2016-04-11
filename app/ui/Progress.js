import React from 'react';

if (process.env.BROWSER) {
  require('./Progress.scss');
}

export default function Progress({ label = 'Loading…', animate, spaced = true }) {
  let className = 'Progress';
  if (animate) {
    className += ' animated';
  }
  if (!spaced) {
    className += ' no-space';
  }
  return (
    <div className={ className }>
      <div className="Progress-wrapper">
        <div className="Progress-label">
          <div className="Progress-animation" />
          { label }
        </div>
      </div>
    </div>
  );
}
