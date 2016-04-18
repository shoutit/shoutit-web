import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Card.scss');
}

export default function Card({ image, title, size = 'small', block = false, children, style, className }) {
  let cssClass = `Card size-${size}`;
  if (block) {
    cssClass += ' block';
  }
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass } style={ style } >
      { image && <div className="Card-image-wrapper">
          <div className="Card-image" style={{ backgroundImage: `url(${image})` }} />
        </div>
      }
      { title &&
        <div className="Card-title">
        { title }
        </div>
      }
      { children && <div>{ children }</div>}
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.element,
  block: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.oneOf(['small']),
};
