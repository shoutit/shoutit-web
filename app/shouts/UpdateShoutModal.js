/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Modal, { Header, Footer, Body } from '../modals';
import Button from '../forms/Button';

import { updateShout } from '../actions/shouts';
import { getShout } from '../reducers/entities/shouts';

import ShoutForm from './ShoutForm';

import './CreateShoutModal.scss';

export class UpdateShoutModal extends Component {

  static propTypes = {
    shoutId: PropTypes.string.isRequired,
    shout: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDeleteConfirm: PropTypes.func.isRequired,
    onShoutChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

    this.state = {
      isUploading: false,
      isSubmitting: false,
      error: null,
      ...this.getStateFromProps(props),
    };
  }

  componentDidMount() {
    this.refs.submit.focus();
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

    // reduce data sent with submit
    const shout = {
      ...this.state.shout,
    };
    delete shout.profile;
    delete shout.conversations;

    this.props.onSubmit(shout)
      .then(this.modal.hide)
      .catch(error => {
        this.setState({
          error,
          isSubmitting: false,
        });
      });
  }

  handleFormChange(shout) {
    if (this.props.onShoutChange) {
      this.props.onShoutChange(shout);
    }
    this.setState({ shout, error: null });
  }
  render() {

    return (
      <Modal
        { ...this.props }
        isSubmitting={ this.state.isSubmitting }
        ref={ el => this.modal = el }>
        <Header closeButton>
          <FormattedMessage
            id="updateShoutModal.title"
            defaultMessage="Update Shout"
          />
        </Header>
        <Body>
          <div className="CreateShoutModal">
            <ShoutForm
              ref="form"
              onChange={ this.handleFormChange }
              onSubmit={ this.handleSubmit }
              mode="update"
              disabled={ this.state.isSubmitting }
              shout={ this.state.shout }
              error={ this.state.error }
              onUploadStart={ () => this.setState({ isUploading: true }) }
              onUploadEnd={ () => this.setState({ isUploading: false }) }
            />
          </div>
        </Body>
        <Footer>
          <Button
            key="cancel"
            type="button"
            onClick={ () => this.modal.hide() }
            disabled={ this.state.isSubmitting }>
            <FormattedMessage
              id="updateShoutModal.publishButton.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>
          <Button
            ref="submit"
            key="submit"
            kind="primary"
            onClick={ this.handleSubmit }
            disabled={ this.state.isSubmitting || this.state.isUploading }>
            { this.state.isUploading ?
              <FormattedMessage
                id="updateShoutModal.publishButton.uploadingImages"
                defaultMessage="Uploading…"
              /> :
              <FormattedMessage
                id="updateShoutModal.publishButton.defaultLabel"
                defaultMessage="Save changes"
              />
            }
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shout: getShout(state, ownProps.shoutId),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (shout, removedImages) => dispatch(updateShout(shout, removedImages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateShoutModal);
