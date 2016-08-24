import React, { PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { loadTagListeners } from '../actions/tags';
import { getListenersByTag, getPaginationState } from '../reducers/paginated/listenersByTag';

import ProfilesListModal from '../users/ProfilesListModal';

export function TagListenersModal({ tag, category, profiles, loadProfiles, pagination, ...props }) {
  const title = (
    <FormattedMessage
      id="tagListenersModal"
      defaultMessage="Listening to {name}"
      values={ { name: category ? category.name : tag.name } }
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

TagListenersModal.propTypes = {
  category: PropTypes.object,
  tag: PropTypes.object.isRequired,
  ...ProfilesListModal.propTypes,
};

const mapStateToProps = (state, ownProps) => ({
  profiles: getListenersByTag(state, ownProps.tag.id),
  pagination: getPaginationState(state, ownProps.tag.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadProfiles: params => dispatch(loadTagListeners(ownProps.tag, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagListenersModal);

