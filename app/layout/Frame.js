import React from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./Frame.scss');
}
export default function Frame({ title, children }) {
  return (
    <div className="Frame">
      <div className="Frame-header">
        <h1>{ title }</h1>
      </div>
      { children }
    </div>
  );
}
