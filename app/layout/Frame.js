import React from 'react';

if (process.env.BROWSER) {
  require('./Frame.scss');
}
export default function Frame({ title, children, transparent = false, style, className = ''}) {
  return (
    <div className={`Frame${transparent ? ' transparent' : ''} ${className}` } style={ style }>
      <div className="Frame-header">
        <h1>{ title }</h1>
      </div>
      { children }
    </div>
  );
}
