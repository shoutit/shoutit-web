import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Panel, { PanelList, PanelTitle } from '../layout/Panel';

import ProfileListItem from '../users/ProfileListItem';

export function SuggestedProfiles({ profiles }) {
  return (
    <Panel>
      <PanelTitle>
        <FormattedMessage id="suggestedProfiles.title" defaultMessage="Suggested Profiles" />
      </PanelTitle>
      <PanelList>
        { profiles.map(profile => <ProfileListItem key={ profile.id } profile={ profile } />) }
      </PanelList>
    </Panel>
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
