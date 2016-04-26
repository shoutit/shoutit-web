import React, { PropTypes } from 'react';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./ProfileCover.scss');
}

export default function ProfileCover({ profile }) {
  return (
    <div className="ProfileCover" style={ getStyleBackgroundImage(profile.cover, 'large') } />
  );
}

ProfileCover.propTypes = {
  profile: PropTypes.shape({ cover: PropTypes.string }),
};
