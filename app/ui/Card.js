import React, { PropTypes } from 'react';

import './Card.scss';

export default function Card({ title, size = 'medium', block = false, children, style, className }) {
  let cssClass = `Card size-${size}`;
  if (block) {
    cssClass += ' block';
  }
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass } style={ style } >
      { title &&
        <div className="Card-title">
        { title }
        </div>
      }
      { children }
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  block: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
};

export function CardImage({ src }) {
  return (
    <div className="CardImage">
      <span style={ { backgroundImage: `url(${src})` } } />
    </div>
  );
}

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
};

export function CardTitle({ children }) {
  return (
    <div className="CardTitle">
      <h4>{ children }</h4>
    </div>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CardList({ children }) {
  return (
    <ul className="CardList">
      { children.map((child, i) => <li key={ i }>{ child }</li>) }
    </ul>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CardBody({ children }) {
  return (
    <div className="CardBody">
      { children }
    </div>
  );
}

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
};
