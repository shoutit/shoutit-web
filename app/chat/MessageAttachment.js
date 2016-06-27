import React, { PropTypes } from 'react';
import ShoutListItem from '../shouts/ShoutListItem';
import ProfileListItem from '../users/ProfileListItem';
import GoogleStaticMap from '../location/GoogleStaticMap';
import MessageAttachedImages from './MessageAttachedImages';

import './MessageAttachment.scss';

function MessageAttachment({ attachment }) {
  let content;
  switch (attachment.type) {
    case 'shout':
      content = (
        <ShoutListItem shout={ attachment.shout } />
      );
      break;
    case 'profile':
      content = (
        <ProfileListItem profile={ attachment.profile } linkToProfilePage popover={ false } />
      );
      break;
    case 'media':
      if (attachment.videos && attachment.videos.length > 0) {
        content = attachment.videos.map(video => <video src={ video.url } controls />);
      }
      if (attachment.images && attachment.images.length > 0) {
        content = <MessageAttachedImages images={ attachment.images } />;
      }
      break;
    case 'location':
      content = (
        <GoogleStaticMap
          width={ 200 }
          height={ 150 }
          center={ attachment.location }
          markers={ [{ ...attachment.location }] }
        />
      );
      break;
    default:
      // content = <p>{ attachment.type }</p>;
      break;
  }
  return <div className={ `MessageAttachment type-${attachment.type}` }>{ content }</div>;
}

MessageAttachment.propTypes = {
  attachment: PropTypes.object.isRequired,
};

export default MessageAttachment;
