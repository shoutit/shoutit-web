import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Card, { CardList, CardTitle } from '../ui/Card';

import ProfileListItem from '../users/ProfileListItem';

export function SuggestedProfiles({ profiles }) {
  return (
    <Card size="small" block>
      <CardTitle>
        <FormattedMessage id="suggestedProfiles.title" defaultMessage="Suggested Profiles" />
      </CardTitle>
      <CardList>
        { profiles.map(profile => <ProfileListItem key={ profile.id } profile={ profile } />) }
      </CardList>
    </Card>
  );
}

SuggestedProfiles.propTypes = {
  profiles: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  const profiles = state.suggestions.users.map(id => state.entities.users[id]);
  return {
    profiles,
  };
};
export default connect(mapStateToProps)(SuggestedProfiles);
