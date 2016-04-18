import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';
import Icon from '../ui/Icon';

import EditShoutModal from './EditShoutModal';

import { openModal, closeModal } from '../actions/ui';

export function EditShoutButton({ shoutId, dispatch, ...props }) {
  function onClick() {
    dispatch(openModal(
      <EditShoutModal
        name="edit-modal"
        shoutId={ shoutId }
        onCancel={ () => dispatch(closeModal('edit-modal')) }
        onSuccess={ () => dispatch(closeModal('edit-modal')) }
      />
    ));
  }
  return (
    <Button onClick={ onClick } size="small" primary leftIcon = { <Icon fill name="pencil" /> } label="Edit Shout" {...props} />
  );
}

EditShoutButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  shoutId: PropTypes.string.isRequired,
};

export default connect()(EditShoutButton);
