import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import UpdateShoutModal from './UpdateShoutModal';

import { openModal, closeModal } from '../actions/ui';

export function UpdateShoutButton({ shoutId, dispatch, ...props }) {
  function onClick() {
    dispatch(openModal(
      <UpdateShoutModal
        name="edit-modal"
        shoutId={ shoutId }
        onCancel={ () => dispatch(closeModal('edit-modal')) }
        onSuccess={ () => dispatch(closeModal('edit-modal')) }
      />
    ));
  }
  return (
    <Button onClick={ onClick } size="small" action="primary" icon="pencil" {...props}>
      { props.children || 'Edit Shout' }
    </Button>
  );
}

UpdateShoutButton.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  shoutId: PropTypes.string.isRequired,
};

export default connect()(UpdateShoutButton);
