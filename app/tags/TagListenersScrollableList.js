import React from 'react';
import { connect } from 'react-redux';
import { loadTagListeners } from '../actions/tags';

import ProfilesScrollableList from '../users/ProfilesScrollableList';

export function TagListenersScrollableList(props) {
  return <ProfilesScrollableList { ...props } />;
}

const mapStateToProps = (state, ownProps) => ({
  ...state.paginated.listenersByTag[ownProps.tag.id],
  profiles: state.entities.users,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadTagListeners(ownProps.tag, endpoint)),
});

const mergeProps = (stateProps, dispatchProps) => {
  let profiles = [];
  if (stateProps.ids) {
    profiles = stateProps.ids.map(id => stateProps.profiles[id]);
  }
  return {
    ...stateProps,
    ...dispatchProps,
    profiles,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TagListenersScrollableList);
