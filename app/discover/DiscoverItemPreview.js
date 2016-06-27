import React, { PropTypes } from 'react';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

import './DiscoverItemPreview.scss';
export default function DiscoverItemPreview({ discoverItem }) {
  return (
    <div className="DiscoverItemPreview" style={ getStyleBackgroundImage(discoverItem.image, 'small') }>
      <h2>{ discoverItem.title }</h2>
    </div>
  );
}

DiscoverItemPreview.propTypes = {
  discoverItem: PropTypes.object.isRequired,
};
