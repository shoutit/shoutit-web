import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Card.scss');
}

export default function Card({ image, title, size = 'small', block = false, children }) {
  let className = `Card size-${size}`;
  if (block) {
    className += `${className} block`;
  }
  return (
    <div className={ className } >
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
  title: PropTypes.string,
  size: PropTypes.oneOf(['small']),
};
