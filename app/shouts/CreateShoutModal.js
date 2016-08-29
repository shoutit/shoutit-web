import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';

import Modal, { Header, Body, Footer } from '../modals';

import Button from '../forms/Button';

import { createShout, saveShoutDraft, resetShoutDraft } from '../actions/shouts';
import { openModal } from '../actions/ui';

import ShoutForm from './ShoutForm';
import CreateShoutSuccessModal from './CreateShoutSuccessModal';
import { getLoggedProfile } from '../reducers/session';
import { getShoutDraft } from '../reducers/shoutDraft';

import './CreateShoutModal.scss';

export class CreateShoutModal extends Component {

  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    shout: PropTypes.object.isRequired,
    onShoutChange: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onCreateSuccess: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = this.getStateFromProps(props);
  }

  state = {
    isUploading: false,
    isSubmitting: false,
    error: null,
  }

  getStateFromProps(props) {
    return {
      shout: props.shout,
    };
  }

  handleSubmit() {
    if (this.state.isSubmitting || this.state.isUploading) {
      return;
    }
    this.setState({ isSubmitting: true });
    this.props.onSubmit(this.props.loggedUser, this.state.shout)
      .then(payload => this.props.onCreateSuccess(payload.result))
      .catch(error => this.setState({
        isSubmitting: false,
        error,
      }));
  }

  handleFormChange(shout) {
    if (this.props.onShoutChange) {
      this.props.onShoutChange(shout);
    }
    this.setState({ shout, error: null });
  }

  hide() {
    this.modal.hide();
  }

  render() {
    return (
      <Modal
        { ...this.props }
        ref={ el => this.modal = el }
        isSubmitting={ this.state.isSubmitting }>
        <Header closeButton>
          <FormattedMessage
            id="createShoutModal.title"
            defaultMessage="{type, select, offer {Post a new offer} request {Post a new request}}"
            values={ { type: this.props.shout.type } }
          />
        </Header>
        <Body>
          <div className="CreateShoutModal">
            <div style={ { marginBottom: '1rem' } }>
              <ShoutForm
                disabled={ this.state.isSubmitting }
                shout={ this.state.shout }
                error={ this.state.error }
                onSubmit={ this.handleSubmit }
                onChange={ this.handleFormChange }
                onUploadStart={ () => this.setState({ isUploading: true }) }
                onUploadEnd={ () => this.setState({ isUploading: false }) }
              />
            </div>
          </div>
        </Body>
        <Footer>
          <Button
            onClick={ this.handleSubmit }
            key="submit"
            kind="primary"
            disabled={ this.state.isSubmitting || this.state.isUploading }>
            { this.state.isUploading ?
              <FormattedMessage
                id="createShoutModal.publishButton.uploadingImages"
                defaultMessage="Uploading…"
              /> :
              <FormattedMessage
                id="createShoutModal.publishButton.defaultLabel"
                defaultMessage="Publish"
              />
            }
          </Button>
        </Footer>
      </Modal>

    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shout: Object.assign(
    {},
    ownProps.shout,
    getShoutDraft(state),
    { type: ownProps.shout.type }
  ),
  loggedUser: getLoggedProfile(state),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (profile, shout) => dispatch(createShout(profile, shout)),
  onShoutChange: shout => dispatch(saveShoutDraft(shout)),
  onCreateSuccess: shoutId => {
    dispatch(resetShoutDraft());
    dispatch(push(`/shout/${shoutId}`));
    dispatch(() => {
      setTimeout(() =>
        dispatch(openModal(<CreateShoutSuccessModal shoutId={ shoutId } />))
      , 1000);
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShoutModal);
