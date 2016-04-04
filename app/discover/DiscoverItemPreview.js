import React from 'react';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./DiscoverItemPreview.scss');
}
export default function DiscoverItemPreview({ discoverItem }) {
  return (
    <div className="DiscoverItemPreview" style={ getStyleBackgroundImage(discoverItem.image, 'small') }>
      <h2>{ discoverItem.title }</h2>
    </div>
  );
}
