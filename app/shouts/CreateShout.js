import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Button from '../ui/Button';

import { createShout, amendShout } from '../actions/shouts';
import { openModal, closeModal } from '../actions/ui';
import Modal from '../ui/Modal';

import ShoutForm from './ShoutForm';
import CreateShoutSuccess from './CreateShoutSuccess';

const NEW_SHOUT_ID = 'new-shout';

if (process.env.BROWSER) {
  require('./CreateShout.scss');
}

export class CreateShout extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    shout: PropTypes.object.isRequired,

    onSuccess: PropTypes.func,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.createShout = this.createShout.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  state = {
    isUploading: false,
  }

  componentWillUnmount() {
    this.amendShout({ createError: null, type: null });
  }

  form = null;

  amendShout(data) {
    const { dispatch, shout } = this.props;
    dispatch(amendShout(shout, data));
  }

  createShout() {
    const { dispatch, shout, loggedUser, onSuccess } = this.props;

    if (shout.isCreating || this.state.isUploading) {
      return;
    }
    dispatch(createShout(loggedUser, shout)).then(payload => {
      const shoutId = payload.result;
      this.showNextSteps(shoutId);
      if (onSuccess) {
        onSuccess();
      }
      dispatch(push(`/shout/${shoutId}`));
    });

  }

  showNextSteps(shoutId) {
    this.props.dispatch(dispatch => {
      setTimeout(() => {
        dispatch(openModal(
          <Modal size="small" name="next-steps">
            <CreateShoutSuccess shoutId={ shoutId } close={ () => dispatch(closeModal('next-steps')) } />
          </Modal>
        ));
      }, 2000);
    });
  }

  handleCancelClick() {
    const { onCancel } = this.props;
    this.form.blur();
    onCancel();
  }

  render() {
    const { shout, error } = this.props;
    const { isUploading } = this.state;
    let submitLabel = 'Publish';
    if (isUploading) {
      submitLabel = 'Uploading…';
    }
    if (shout.isCreating) {
      submitLabel = 'Publishing…';
    }
    return (
      <div className="CreateShout">
          { !shout.type ?
            <div>
              <p style={ { margin: 0, textAlign: 'center' } }>What are you posting?</p>
              <div style={ { width: '50%', margin: '2rem auto 1rem auto' } }>
                <Button primary block style={ { margin: '0 .5rem .5rem .5rem' } } onClick={ () => this.amendShout({ type: 'offer' }) } label="Offer" />
                <Button secondary block style={ { margin: '.5rem .5rem 0 .5rem' } } onClick={ () => this.amendShout({ type: 'request' }) } label="Request" />
              </div>
            </div> :
            <div style={ { marginBottom: '1rem' } }>
              <h1>New { shout.type }</h1>
              <ShoutForm
                inputRef={ el => { this.form = el; } }
                disabled={ shout.isCreating }
                shout={ shout }
                error={ error }
                onChange={ data => this.amendShout({ ...data, createError: null }) }
                onSubmit={ this.createShout }
                onCancel={ this.handleCancelClick }
                onUploadStart={ () => this.setState({ isUploading: true }) }
                onUploadEnd={ () => this.setState({ isUploading: false }) }
                actions={ [
                  <Button type="button" label="Cancel" onClick={ this.handleCancelClick } disabled={ shout.isCreating } />,
                  <Button primary style={ { minWidth: '10rem' } } label={ submitLabel } disabled={ shout.isCreating || isUploading } />,
                ] }
              />
            </div>
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { entities, currentLocation, session } = state;

  const shout = entities.shouts[NEW_SHOUT_ID] || {
    id: NEW_SHOUT_ID,
    mobile: session.user.mobile,
    type: null,
    location: session.user.location || currentLocation,
  };

  return {
    shout,
    error: shout.createError,
    loggedUser: session.user,
  };
};

export default connect(mapStateToProps)(CreateShout);
