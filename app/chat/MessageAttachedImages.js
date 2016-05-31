import React, { PropTypes } from 'react';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./MessageAttachedImages.scss');
}

export default function MessageAttachedImages({ images }) {
  return (
    <div className={ `MessageAttachedImages has-${images.length}` }>
      {
        images.map((image, i) =>
          <a
            target="_blank"
            href={ getVariation(image, 'large') }
            className="MessageAttachedImages-image"
            key={ i }
            style={ getStyleBackgroundImage(image, 'medium') }
          />
        ) }
    </div>
  );
}

MessageAttachedImages.propTypes = {
  images: PropTypes.array.isRequired,
};
