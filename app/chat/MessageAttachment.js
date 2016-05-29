import React, { PropTypes } from 'react';
import { getVariation } from '../utils/APIUtils';
import ShoutPreview from '../shouts/ShoutPreview';
import ProfilePreview from '../users/ProfilePreview';
import GoogleStaticMap from '../location/GoogleStaticMap';

if (process.env.BROWSER) {
  require('./MessageAttachment.scss');
}

function MessageAttachment({ attachment }) {
  let content;
  switch (attachment.type) {
    case 'shout':
      content = (
        <ShoutPreview
          shout={ attachment.shout }
          thumbnailRatio={ 16 / 9 }
          showProfile={ false }
        />
      );
      break;
    case 'profile':
      content = (
        <ProfilePreview id={ attachment.profile.id } />
      );
      break;
    case 'media':
      if (attachment.videos) {
        content = attachment.videos.map(video => <video src={ video.url } controls />);
      }
      if (attachment.images) {
        content = attachment.images.map((image, i) => <img alt="" key={ i } src={ getVariation(image, 'medium') } />);
      }
      break;
    case 'location':
      content = (
        <GoogleStaticMap
          center={ attachment.location }
          markers={ [{ ...attachment.location }] }
        />
      );
      break;
    default:
      // content = <p>{ attachment.type }</p>;
      break;
  }
  return <div className="MessageAttachment">{ content }</div>;
}

MessageAttachment.propTypes = {
  attachment: PropTypes.object.isRequired,
};

export default MessageAttachment;
