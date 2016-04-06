import React, { PropTypes } from 'react';

import ProfileFromListItem from './ProfileFromListItem';
import ProfileWebsiteListItem from './ProfileWebsiteListItem';
import ProfileJoinedOnListItem from './ProfileJoinedOnListItem';
import ProfileListeningListItem from './ProfileListeningListItem';
import ProfileListenersListItem from './ProfileListenersListItem';
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
              { profile.location && <ProfileFromListItem profile={ profile } /> }
              { profile.dateJoined && <ProfileJoinedOnListItem profile={ profile } /> }
              { profile.website && <ProfileWebsiteListItem profile={ profile } /> }
          </div>
        }

        { profile.listeningCount &&
          <div className="ProfileBiography-connections">
            <ProfileListeningListItem profile={ profile } />
            <ProfileListenersListItem profile={ profile } />
          </div>
        }

        <div className="ProfileBiography-actions">
          { profile.isListening &&
            <p className="ProfileBiography-isListening">
              { profile.firstName } is listening to you.
            </p>
          }
          <ProfileActions profile = { profile } />
        </div>

        { profile.about &&
          <div className="ProfileBiography-about">
            <p>
              { profile.about }
            </p>
          </div>
        }
    </div>
  );
}

ProfileBiography.propTypes = {
  profile: PropTypes.object.isRequired,
};
