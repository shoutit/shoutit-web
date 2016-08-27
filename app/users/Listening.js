import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Panel, { PanelTitle, PanelList } from '../layout/Panel';
import ProfileListItem from '../users/ProfileListItem';
import { getListeningByProfile } from '../reducers/paginated/listeningByUser';

export function Listening({ profiles }) {
  if (!profiles || profiles.length === 0) {
    return <span />;
  }
  return (
    <Panel>
      <PanelTitle>
        <FormattedMessage
          id="userListeningPanel.title"
          defaultMessage="Listening to"
        />
      </PanelTitle>
      <PanelList>
      { profiles && profiles.map(profile =>
        <ProfileListItem key={ profile.id } profile={ profile } />) }
      </PanelList>
    </Panel>
  );
}

Listening.propTypes = {
  profiles: PropTypes.array,
  byProfile: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  profiles: getListeningByProfile(state, ownProps.byProfile),
});
export default connect(mapStateToProps)(Listening);
