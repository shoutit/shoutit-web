import React from 'react';

if (process.env.BROWSER) {
  require('./Progress.scss');
}

export default function Progress({ label = 'Loading…', animate }) {
  let className = 'Progress';
  if (animate) {
    className += ' animated';
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
