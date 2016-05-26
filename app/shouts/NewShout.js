import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import { openModal, closeModal } from '../actions/ui';
import CreateShout from '../shouts/CreateShout';
import { getLoggedUser } from '../selectors';
const NEW_SHOUT_ID = '__new__';

export class NewShout extends Component {

  static propTypes = {
    newShout: PropTypes.object.isRequired,
    openCreateModal: PropTypes.func.isRequired,
  }

  render() {
    const { newShout } = this.props;
    return (
      <div className="NewShout">
        <div style={ { width: '50%', margin: '0 auto' } }>
          <Button
            block
            action="primary"
            style={ { margin: '0 .5rem .5rem .5rem' } }
            onClick={ () => this.props.openCreateModal({ ...newShout, type: 'offer' }) }>
            Offer
          </Button>
          <Button
            block
            action="primary-alt"
            style={ { margin: '.5rem .5rem 0 .5rem' } }
            onClick={ () => this.props.openCreateModal({ ...newShout, type: 'request' }) }>
            Request
          </Button>
        </div>
      </div>
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
  openCreateModal: shout => {
    dispatch(openModal(
      <CreateShout
        shout={ shout }
        onSuccess={ () => dispatch(closeModal()) }
        onCancel={ () => dispatch(closeModal()) } />,
        { title: 'Create a Shout', backdrop: 'static' }
    )); },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewShout);
