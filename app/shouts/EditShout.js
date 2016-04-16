import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Button from '../ui/Button';

import { updateShout } from '../actions/shouts';
import { openModal, closeModal } from '../actions/ui';
import Modal from '../ui/Modal';

import ShoutForm from './ShoutForm';
//
// if (process.env.BROWSER) {
//   require('./EditShout.scss');
// }

export class EditShout extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    // loggedUser: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    shout: PropTypes.object.isRequired,
    shoutId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.updateShout = this.updateShout.bind(this);
  }
  //
  // componentWillUnmount() {
  //   this.amendShout({ createError: null, type: null });
  // }

  form = null;

  updateShout() {
    // const { dispatch, shout, loggedUser, onSuccess } = this.props;
    //
    // if (shout.isUpdating) {
    //   return;
    // }
    // dispatch(updateShout(loggedUser, shout)).then(payload => {
    //   const shoutId = payload.result;
    //   this.showNextSteps(shoutId);
    //   if (onSuccess) {
    //     onSuccess();
    //   }
    //   dispatch(push(`/shout/${shoutId}`));
    // });

  }

  render() {
    const { shout, error, onCancel } = this.props;
    return (
      <div className="EditShout">
        <ShoutForm
          full
          disabled={ shout.isUpdating }
          shout={ shout }
          error={ error }
          onSubmit={ this.updateShout }
          onCancel={ this.handleCancelClick }
          actions={[
            <Button type="button" label="Cancel" onClick={ onCancel } disabled={ shout.isUpdating } />,
            <Button primary label="Publish" disabled={ shout.isUpdating } />,
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    shout: state.entities.shouts[ownProps.shoutId],
  };
  // const { entities,, session } = state;
  //
  // return {
  //   shout,
  //   error: shout.createError,
  //   loggedUser: session.user,
  // };
};

export default connect(mapStateToProps)(EditShout);
