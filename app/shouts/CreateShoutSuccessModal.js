import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Modal, { Body, Header } from '../modals';
import Button from '../forms/Button';
import HorizontalRule from '../widgets/HorizontalRule';
import NewShoutModal from '../shouts/NewShoutModal';
import ShoutUpdateButton from '../shouts/ShoutUpdateButton';

import { openModal, closeModal } from '../actions/ui';

import './CreateShoutSuccessModal.scss';

export function CreateShoutSuccessModal({ shoutId, onNewClick, ...modalProps }) {
  return (
    <Modal { ...modalProps } autoSize={ false } size="small">
      <Header closeButton>
        <FormattedMessage
          id="createShoutSuccessModal.title"
          defaultMessage="Congratulations!"
        />
      </Header>
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
            <ShoutUpdateButton shoutId={ shoutId } block kind="primary" icon={ null }>
              <FormattedMessage
                id="createShoutSuccessModal.editButton"
                defaultMessage="Add more details"
              />
            </ShoutUpdateButton>
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
