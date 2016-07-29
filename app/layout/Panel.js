import React, { PropTypes } from 'react';

import './Panel.scss';

export default function Panel({ children, style, className }) {
  let cssClass = 'Panel';
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass } style={ style }>
      { children }
    </div>
  );
}

Panel.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  block: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'flexible-medium']),
};

export function PanelTitle({ children }) {
  return (
    <div className="PanelTitle">
      <h4>{ children }</h4>
    </div>
  );
}

PanelTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export function PanelList({ children }) {
  return (
    <ul className="PanelList">
      { children.map((child, i) => <li key={ i }>{ child }</li>) }
    </ul>
  );
}

PanelList.propTypes = {
  children: PropTypes.node.isRequired,
};

export function PanelSection({ children, separe }) {
  let className = 'PanelSection';
  if (separe) {
    className += ' separe';
  }
  return (
    <div className={ className }>
      { children }
    </div>
  );
}

PanelSection.propTypes = {
  children: PropTypes.node.isRequired,
  separe: PropTypes.bool,
};
