import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Modal, { Header, Body } from '../ui/Modal';
import Button from '../ui/Button';

import { openModal } from '../actions/ui';
import CreateShoutModal from '../shouts/CreateShoutModal';
import { getLoggedUser } from '../selectors';
const NEW_SHOUT_ID = '__new__';

export class NewShoutModal extends Component {

  static propTypes = {
    newShout: PropTypes.object.isRequired,
    openCreateModal: PropTypes.func.isRequired,
  }

  render() {
    const { newShout, ...modalProps } = this.props;
    return (
      <Modal {...modalProps} size="small">
        <Header closeButton>
          <FormattedMessage
            id="newShoutModal.title"
            defaultMessage="What are you posting?"
          />
        </Header>
        <Body>
          <div>
            <div style={ { width: '50%', margin: '0 auto' } }>
              <Button
                block
                action="primary"
                style={ { margin: '0 .5rem .5rem .5rem' } }
                onClick={ () => this.props.openCreateModal({ ...newShout, type: 'offer' }) }>
                <FormattedMessage
                  id="newShoutModal.offerButton"
                  defaultMessage="Offer"
                />
              </Button>
              <Button
                block
                action="primary-alt"
                style={ { margin: '.5rem .5rem 0 .5rem' } }
                onClick={ () => this.props.openCreateModal({ ...newShout, type: 'request' }) }>
                <FormattedMessage
                  id="newShoutModal.requestButton"
                  defaultMessage="Request"
                />
              </Button>
            </div>
          </div>
        </Body>
      </Modal>

    );
  }
}

const mapStateToProps = state => {
  const { currentLocation } = state;
  return {
    newShout: {
      id: NEW_SHOUT_ID,
      mobile: getLoggedUser(state).mobile,
      location: currentLocation,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  openCreateModal: shout => dispatch(openModal(<CreateShoutModal shout={ shout } />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewShoutModal);
