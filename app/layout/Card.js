import React, { PropTypes } from 'react';
import { backgroundImageStyle } from '../utils/DOMUtils';

import './Card.scss';

export default function Card({ children, style, className }) {
  let cssClass = 'Card';
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass } style={ style }>
      <div className="Card-content">
        { children }
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  block: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'flexible-medium']),
};

export function CardImage({ src }) {
  return (
    <div className="CardImage">
      <span style={ backgroundImageStyle({ url: src, variation: 'medium' }) } />
    </div>
  );
}

CardImage.propTypes = {
  src: PropTypes.string,
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

export function CardSection({ children, separe }) {
  let className = 'CardSection';
  if (separe) {
    className += ' separe';
  }
  return (
    <div className={ className }>
      { children }
    </div>
  );
}

CardSection.propTypes = {
  children: PropTypes.node.isRequired,
  separe: PropTypes.bool,
};

export function CardList({ children }) {
  return (
    <ul className="CardList">
      { children.map((child, i) => <li key={ i }>{ child }</li>) }
    </ul>
  );
}

CardList.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CardBody({ children, style }) {
  return (
    <div className="CardBody" style={ style }>
      { children }
    </div>
  );
}

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};
