import React, { PropTypes } from 'react';
import Modal from '../ui/Modal';
import UpdateShout from './UpdateShout';

export default function UpdateShoutModal({ name, shoutId, onCancel, onSuccess }) {
  return (
    <Modal name={ name }>
      <UpdateShout rootClose={ false } shoutId={ shoutId } onCancel={ onCancel } onSuccess={ onSuccess } />
    </Modal>
  );
}

UpdateShoutModal.propTypes = {
  shoutId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
