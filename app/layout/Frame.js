import React, { PropTypes } from 'react';

import './Frame.scss';

export default function Frame({ title, children, transparent = false, style, className = '' }) {
  return (
    <div className={ `Frame${transparent ? ' transparent' : ''} ${className}` } style={ style }>
      <div className="Frame-header">
        <h1>{ title }</h1>
      </div>
      { children }
    </div>
  );
}

Frame.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  transparent: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};
