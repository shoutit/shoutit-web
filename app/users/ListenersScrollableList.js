import React from 'react';
import { connect } from 'react-redux';
import { loadListeners, loadListeningProfiles } from '../actions/users';

import ProfilesScrollableList from '../users/ProfilesScrollableList';

export function ListenersScrollableList(props) {
  return <ProfilesScrollableList { ...props } />;
}

const mapStateToProps = (state, { profile, type = 'listeners' }) => ({
  ...state.paginated[
    type === 'listeners' ? 'listenersByUser' : 'listeningByUser'
  ][profile.id],
  profiles: state.entities.users,
});

const mapDispatchToProps = (dispatch, { profile, type = 'listeners' }) => ({
  loadData: endpoint => dispatch(
    type === 'listeners' ?
      loadListeners(profile, endpoint) :
      loadListeningProfiles(profile, endpoint)
  ),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let profiles = [];
  if (stateProps.ids) {
    profiles = stateProps.ids.map(id => stateProps.profiles[id]);
  }
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    profiles,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ListenersScrollableList);
