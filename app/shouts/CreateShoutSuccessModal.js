import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Modal, { Body } from '../modals';
import Button from '../forms/Button';
import HorizontalRule from '../ui/HorizontalRule';
import NewShoutModal from '../shouts/NewShoutModal';
import UpdateShoutButton from '../shouts/UpdateShoutButton';

import { openModal, closeModal } from '../actions/ui';

import './CreateShoutSuccessModal.scss';

export function CreateShoutSuccessModal({ shoutId, onNewClick, ...modalProps }) {
  return (
    <Modal { ...modalProps } size="small">
      <Body>
        <div className="CreateShoutSuccessModal">

          <h2>
            <FormattedMessage
              id="createShoutSuccessModal.title"
              defaultMessage="Congratulations!"
            />
          </h2>

          <h3>
            <FormattedMessage
              id="createShoutSuccessModal.subtitle"
              defaultMessage="Your shout has been published."
            />
          </h3>

          <div className="CreateShoutSuccessModal-buttons">
            <UpdateShoutButton shoutId={ shoutId } block kind="primary" icon={ null }>
              <FormattedMessage
                id="createShoutSuccessModal.editButton"
                defaultMessage="Add more details"
              />
            </UpdateShoutButton>
          </div>

          <HorizontalRule label="or" />

          <div className="CreateShoutSuccessModal-buttons">
            <Button block kind="secondary" onClick={ onNewClick }>
              <FormattedMessage
                id="createShoutSuccessModal.createButton"
                defaultMessage="Create another shout"
              />
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
