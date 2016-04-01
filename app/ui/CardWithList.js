import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./CardWithList.scss');
}

export default function CardWithList({ children = [], title }) {
  return (
    <div className="CardWithList">
      { title && <h3>{ title }</h3> }
      { children.length > 0 &&
        <ul>
          { children.map((child, i) => <li key={ i}>{ child }</li>)}
        </ul>
      }
    </div>
  );
}

CardWithList.propTypes = {
  children: PropTypes.array,
  title: PropTypes.string,
};
