import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CardWithList from '../ui/CardWithList';
import ProfileListItem from '../users/ProfileListItem';

export function Listening({ profiles }) {
  return (
    <CardWithList title="Listening to">
      { profiles.map(profile => <ProfileListItem profile={ profile } />
    )}
    </CardWithList>
  );
}

Listening.PropTypes = {
  profiles: PropTypes.array.isRequired,
  byProfile: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  let profiles = [];
  const { byProfile } = ownProps;
  if (state.paginated.listeningByUser[byProfile.id]) {
    profiles = state.paginated.listeningByUser[byProfile.id].ids.map(id => state.entities.users[id]);
  }
  return {
    profiles,
  };
};
export default connect(mapStateToProps)(Listening);
