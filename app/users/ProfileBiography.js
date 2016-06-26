import React, { PropTypes } from 'react';

import LocationListItem from '../location/LocationListItem';
import ProfileWebsiteListItem from './ProfileWebsiteListItem';
import ProfileJoinedOnListItem from './ProfileJoinedOnListItem';
import ProfileListenersListItem from './ProfileListenersListItem';
import ProfileListeningTagsListItem from './ProfileListeningTagsListItem';
import ProfileActions from '../users/ProfileActions';

if (process.env.BROWSER) {
  require('./ProfileBiography.scss');
}

export default function ProfileBiography({ profile }) {
  return (
    <div className="ProfileBiography">

      <p className="ProfileBiography-bio">
        { profile.bio }
      </p>

      { (profile.location || profile.dateJoined || profile.website) &&
        <div className="ProfileBiography-details">
            { profile.location && <LocationListItem size="small" location={ profile.location } /> }
            { profile.dateJoined && <ProfileJoinedOnListItem size="small" profile={ profile } /> }
            { profile.website && <ProfileWebsiteListItem size="small" profile={ profile } /> }
        </div>
      }

      <div className="ProfileBiography-connections">
        <ProfileListenersListItem profile={ profile } />
        { profile.listeningCount && <ProfileListenersListItem type="listening" profile={ profile } /> }
        { profile.listeningCount && <ProfileListeningTagsListItem profile={ profile } /> }
      </div>

      { !profile.isOwner &&
        <div className="ProfileBiography-actions">
          <ProfileActions profile={ profile } />
        </div>
      }
    </div>
  );
}

ProfileBiography.propTypes = {
  profile: PropTypes.object.isRequired,
};
