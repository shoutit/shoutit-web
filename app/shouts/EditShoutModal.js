import React, { PropTypes } from 'react';
import Modal from '../ui/Modal';
import EditShout from './EditShout';

export default function EditShoutModal({ name, shoutId, onCancel, onSuccess }) {
  return (
    <Modal name={ name }>
      <EditShout rootClose={ false } shoutId={ shoutId } onCancel={ onCancel } onSuccess= { onSuccess } />
    </Modal>
  );
}

EditShoutModal.propTypes = {
  shoutId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};
