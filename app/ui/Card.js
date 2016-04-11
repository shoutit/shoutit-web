import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Card.scss');
}

export default function Card({ image, title, size = 'small', block = false }) {
  let className = `Card size-${size}`;
  if (block) {
    className += `${className} block`;
  }
  return (
    <div className={ className } >
      <div className="Card-image-wrapper">
        <div className="Card-image" style={{ backgroundImage: `url(${image})` }} />
      </div>
      <div className="Card-title">
        { title }
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small']),
};
