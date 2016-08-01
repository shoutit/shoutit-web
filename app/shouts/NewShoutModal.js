import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getLoggedUser } from '../reducers/session';
import { getCurrentLocation } from '../reducers/currentLocation';

import Modal, { Header, Body } from '../modals';
import Button from '../forms/Button';

import { openModal } from '../actions/ui';
import CreateShoutModal from '../shouts/CreateShoutModal';

import './NewShoutModal.scss';

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
          <div className="NewShoutModal">
            <p className="NewShoutModal-intro">
              <FormattedMessage
                id="shouts.newShoutModal.introduction"
                defaultMessage="{colouredOfferText} any product or a service on Shoutit marketplace. Do you need anything? {colouredRequestText} it and wait to be contacted by someone who has it."
                values={ {
                  colouredOfferText: <span className="text-offer"><FormattedMessage id="shouts.newShoutModal.colouredOfferText" defaultMessage="Offer" /></span>,
                  colouredRequestText: <span className="text-request"><FormattedMessage id="shouts.newShoutModal.colouredRequestText" defaultMessage="Request" /></span>,
                } }
                />
            </p>
            <div>
              <Button
                ref="offerButton"
                className="NewShoutModal-offer"
                block
                kind="primary"
                onClick={ this.handleButtonClick.bind(this, 'offer') }>
                <FormattedMessage
                  id="newShoutModal.offerButton"
                  defaultMessage="Offer"
                />
              </Button>
              <Button
                block
                className="NewShoutModal-request"
                kind="primary"
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
    location: getCurrentLocation(state),
  },
});

const mapDispatchToProps = dispatch => ({
  openCreateModal: shout =>
    dispatch(openModal(<CreateShoutModal shout={ shout } />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewShoutModal);
