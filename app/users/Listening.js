import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CardWithList from '../ui/CardWithList';
import ProfileListItem from '../users/ProfileListItem';

export function Listening({ profiles }) {
  if (profiles.length === 0) {
    return <span />;
  }
  return (
    <CardWithList title="Listening to">
      { profiles.map(profile => <ProfileListItem key={ profile.id } profile={ profile } />
    )}
    </CardWithList>
  );
}

Listening.propTypes = {
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
