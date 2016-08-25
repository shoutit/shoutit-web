import React from 'react';

import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { loadListeners, loadListeningProfiles } from '../actions/users';
import {
  getListenersByProfile,
  getPaginationState as getListenersPaginationState,
} from '../reducers/paginated/listenersByUser';

import {
  getListeningByProfile,
  getPaginationState as getListeningPaginationState,
} from '../reducers/paginated/listeningByUser';

import ProfilesListModal from '../users/ProfilesListModal';

/**
 * A modal displaying a list of profiles listened (`type="listeners"`) or listening to
 * (`type="listening"`) a profile.
 *
 * @param {any} { profile, type, profiles, loadProfiles, pagination,
 * @param {any} props
 */
function ListenersModal({ profile, type, profiles, loadProfiles, pagination, ...props }) {
  const title = (
    <FormattedMessage
      id="listenersModal.title"
      defaultMessage="{type, select,
        listeners {Listening to {name}}
        listening {{name} is listening to}
      }"
      values={ {
        type,
        name: profile.name,
      } }
      />
  );
  return (
    <ProfilesListModal
      title={ title }
      profiles={ profiles }
      loadProfiles={ loadProfiles }
      pagination={ pagination }
      { ...props }
    />
  );
}

ListenersModal.propTypes = {
  type: PropTypes.oneOf(['listeners', 'listening']),
  profile: PropTypes.object.isRequired,

  profiles: PropTypes.array,
  title: PropTypes.node.isRequired,
  loadProfiles: PropTypes.func.isRequired,
  pagination: PropTypes.shape(PaginationPropTypes),
};

function mapStateToProps(state, ownProps) {
  let profiles;
  let pagination;
  const { id } = ownProps.profile;
  if (ownProps.type === 'listening') {
    profiles = getListeningByProfile(state, id);
    pagination = getListeningPaginationState(state, id);
  } else {
    profiles = getListenersByProfile(state, id);
    pagination = getListenersPaginationState(state, id);
  }

  return {
    profiles,
    pagination,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadProfiles:
    params => {
      let action;
      if (ownProps.type === 'listening') {
        action = loadListeningProfiles;
      } else {
        action = loadListeners;
      }
      return dispatch(action(ownProps.profile, params));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListenersModal);

