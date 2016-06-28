import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Modal, { Header, Body } from '../ui/Modal';
import Button from '../ui/Button';

import { openModal } from '../actions/ui';
import CreateShoutModal from '../shouts/CreateShoutModal';
import { getLoggedUser } from '../reducers/session';

export class NewShoutModal extends Component {

  static propTypes = {
    shout: PropTypes.object.isRequired,
    openCreateModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.refs.offerButton.focus();
  }

  handleButtonClick(shoutType) {
    this.props.openCreateModal({
      ...this.props.shout,
      type: shoutType,
    });
  }

  render() {
    return (
      <Modal { ...this.props } size="small">
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
                ref="offerButton"
                block
                kind="primary"
                style={ { margin: '0 .5rem .5rem .5rem' } }
                onClick={ this.handleButtonClick.bind(this, 'offer') }>
                <FormattedMessage
                  id="newShoutModal.offerButton"
                  defaultMessage="Offer"
                />
              </Button>
              <Button
                block
                kind="secondary"
                style={ { margin: '.5rem .5rem 0 .5rem' } }
                onClick={ this.handleButtonClick.bind(this, 'request') }>
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

const mapStateToProps = state => ({
  shout: {
    mobile: getLoggedUser(state).mobile,
    location: state.currentLocation,
  },
});

const mapDispatchToProps = dispatch => ({
  openCreateModal: shout =>
    dispatch(openModal(<CreateShoutModal shout={ shout } />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewShoutModal);
