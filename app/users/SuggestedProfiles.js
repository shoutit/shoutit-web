import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CardWithList from '../ui/CardWithList';
import ProfileListItem from '../users/ProfileListItem';

export function SuggestedProfiles({ profiles }) {
  return (
    <CardWithList title="Suggested profiles">
      { profiles.map(profile => <ProfileListItem profile={ profile } />
    )}
    </CardWithList>
  );
}

SuggestedProfiles.PropTypes = {
  profiles: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  const profiles = state.suggestions.users.map(id => state.entities.users[id]);
  return {
    profiles,
  };
};
export default connect(mapStateToProps)(SuggestedProfiles);
