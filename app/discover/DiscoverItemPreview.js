import React, { PropTypes } from 'react';

import { backgroundImageStyle } from '../utils/DOMUtils';
import './DiscoverItemPreview.scss';

export default function DiscoverItemPreview({ discoverItem }) {
  return (
    <div
      className="DiscoverItemPreview"
      style={ backgroundImageStyle({ url: discoverItem.image, variation: 'small' }) }>
      <h2>{ discoverItem.title }</h2>
    </div>
  );
}

DiscoverItemPreview.propTypes = {
  discoverItem: PropTypes.object.isRequired,
};
