import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';

import EditShout from './EditShout';

import { openModal, closeModal } from '../actions/ui';

export function EditShoutButton({ onClick, ...props }) {
  return (
    <Button onClick={ onClick } size="small" primary leftIcon = { <Icon fill name="pencil" /> } label="Edit Shout" {...props} />
  );
}

EditShoutButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  shoutId: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {

  const editModal = (
    <Modal name="edit-shout">
      <EditShout rootClose={ false } shoutId={ ownProps.shoutId } onCancel={ () => dispatch(closeModal('edit-shout')) } />
    </Modal>
  );
  return {
    onClick: () => dispatch(openModal(editModal)),
  };
};

export default connect(null, mapDispatchToProps)(EditShoutButton);
