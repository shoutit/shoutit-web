import React, { PropTypes } from 'react';
import { backgroundImageStyle } from '../utils/DOMUtils';
import { getVariation } from '../utils/APIUtils';

import './MessageAttachedImages.scss';

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
            style={ backgroundImageStyle({ url: image, variation: 'medium' }) }
          />
        ) }
    </div>
  );
}

MessageAttachedImages.propTypes = {
  images: PropTypes.array.isRequired,
};
