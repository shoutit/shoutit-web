import React, { PropTypes } from 'react';

import ShoutPreview from '../shouts/ShoutPreview';
// import ProfilePreview from '../users/ProfilePreview';
import GoogleStaticMap from '../location/GoogleStaticMap';

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
    // case 'profile':
    //   content = (
    //     <ProfilePreview id={ attachment.profile.id } />
    //   );
    //   break;
    case 'media':
      if (attachment.videos) {
        content = attachment.videos.map(video => <video src={ video.url } controls />);
      }
      if (attachment.images) {
        // content = <p>Images</p>;
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
