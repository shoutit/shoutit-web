import React, { PropTypes } from 'react';

import './CardWithList.scss';

export default function CardWithList({ children = [], title, style }) {
  return (
    <div className="CardWithList" style={ style }>
      { title && <h3>{ title }</h3> }
      { Array.isArray(children) ?
        children.length > 0 &&
          <ul>
            { children.map((child, i) => <li key={ i }>{ child }</li>) }
          </ul> :
        children
      }
    </div>
  );
}

CardWithList.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  style: PropTypes.object,
};
