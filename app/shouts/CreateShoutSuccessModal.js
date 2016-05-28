import React, { PropTypes } from 'react';
import Modal, { Body } from '../ui/Modal';
import { connect } from 'react-redux';

import Button from '../ui/Button';
import HorizontalRule from '../ui/HorizontalRule';
import NewShoutModal from '../shouts/NewShoutModal';
import UpdateShoutButton from '../shouts/UpdateShoutButton';

import { openModal, closeModal } from '../actions/ui';

if (process.env.BROWSER) {
  require('./CreateShoutSuccessModal.scss');
}

export function CreateShoutSuccessModal({ shoutId, onNewClick, ...modalProps }) {
  return (
    <Modal {...modalProps} size="small">
      <Body>
        <div className="CreateShoutSuccessModal">

          <h2>Congratulations!</h2>

          <h3>Your shout has been published.</h3>

          <div className="CreateShoutSuccessModal-buttons">
            <UpdateShoutButton shoutId={ shoutId } block size="small" action="primary" icon={ null }>
              Add more details
            </UpdateShoutButton>
          </div>

          <HorizontalRule label="or" />

          <div className="CreateShoutSuccessModal-buttons">
            <Button block size="small" action="primary-alt" onClick={ onNewClick }>
              Create another shout
            </Button>
          </div>


        </div>
      </Body>
    </Modal>
  );
}

CreateShoutSuccessModal.propTypes = {
  shoutId: PropTypes.string.isRequired,
  onNewClick: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onNewClick: () => {
    dispatch(closeModal());
    dispatch(openModal(<NewShoutModal />));
  },
  close: () => dispatch(closeModal()),
});

export default connect(null, mapDispatchToProps)(CreateShoutSuccessModal);
