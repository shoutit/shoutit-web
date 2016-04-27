import React, { PropTypes } from 'react';

import { connect } from 'react-redux';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import HorizontalRule from '../ui/HorizontalRule';
import CreateShout from '../shouts/CreateShout';
import UpdateShoutButton from '../shouts/UpdateShoutButton';

import { openModal, closeModal } from '../actions/ui';

if (process.env.BROWSER) {
  require('./CreateShoutSuccess.scss');
}

export function CreateShoutSuccess({ shoutId, onNewClick }) {
  return (
    <div className="CreateShoutSuccess">

      <h2>Congratulations!</h2>

      <h3>Your shout has been published.</h3>

      <div className="CreateShoutSuccess-buttons">
        <UpdateShoutButton shoutId={ shoutId } block size="small" action="primary">
          Add more details
        </UpdateShoutButton>
      </div>

      <HorizontalRule label="or" />

      <div className="CreateShoutSuccess-buttons">
        <Button block size="small" action="primary-alt" onClick={ onNewClick }>
          Create another shout
        </Button>
      </div>


    </div>
  );
}

CreateShoutSuccess.propTypes = {
  shoutId: PropTypes.string.isRequired,
  onNewClick: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const newShoutModal = (
    <Modal name="new-shout">
      <CreateShout
        modalName="new-shout"
        onCancel={ () => dispatch(closeModal('new-shout')) }
        onSuccess={ () => dispatch(closeModal('new-shout')) }
      />
    </Modal>
  );

  return {
    onNewClick: () => {
      ownProps.close();
      setTimeout(() => dispatch(openModal(newShoutModal)), 500);
    },
  };
};

export default connect(null, mapDispatchToProps)(CreateShoutSuccess);
