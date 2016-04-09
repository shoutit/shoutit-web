import React from 'react';

if (process.env.BROWSER) {
  require('./Frame.scss');
}
export default function Frame({ title, children, transparent = false }) {
  return (
    <div className={`Frame${transparent ? ' transparent' : ''}`}>
      <div className="Frame-header">
        <h1>{ title }</h1>
      </div>
      { children }
    </div>
  );
}
