import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Card, { CardTitle, CardList } from '../ui/Card';
import ProfileListItem from '../users/ProfileListItem';
import { denormalize } from '../schemas';

export function Listening({ profiles }) {
  if (profiles.length === 0) {
    return <span />;
  }
  return (
    <Card block size="small">
      <CardTitle>
        <FormattedMessage
          id="userListeningCard.title"
          defaultMessage="Listening to"
        />
      </CardTitle>
      <CardList>
      { profiles.map(profile =>
        <ProfileListItem key={ profile.id } profile={ profile } />) }
      </CardList>
    </Card>
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
    profiles = state.paginated.listeningByUser[byProfile.id].ids.map(
      id => denormalize(state.entities.users[id], state.entities, 'PROFILE')
    );
  }
  return {
    profiles,
  };
};
export default connect(mapStateToProps)(Listening);
