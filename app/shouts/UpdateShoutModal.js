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

export class UpdateShout extends Component {

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
      isUpdating: false,
      isDeleting: false,
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
    if (this.state.isUpdating || this.state.isUploading || this.state.isDeleting) {
      return;
    }
    this.setState({ isUpdating: true });

    // reduce data sent with submit
    const shout = {
      ...this.state.shout,
    };
    delete shout.profile;
    delete shout.conversations;

    this.props.onSubmit(shout)
      .then(this.refs.modal.hide)
      .catch(error => {
        this.setState({
          error,
          isUpdating: false,
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
    let submitLabel = 'Save changes';

    if (this.state.isUploading) {
      submitLabel = (
        <FormattedMessage
          id="updateShoutModal.publishButton.uploadingImages"
          defaultMessage="Uploading…"
        />
      );
    } else if (this.state.isUpdating) {
      submitLabel = (
        <FormattedMessage
          id="updateShoutModal.publishButton.publishing"
          defaultMessage="Publishing…"
        />
      );
    } else if (this.state.isDeleting) {
      submitLabel = (
        <FormattedMessage
          id="updateShoutModal.publishButton.deleting"
          defaultMessage="Deleting…"
        />
      );
    } else {
      submitLabel = (
        <FormattedMessage
          id="updateShoutModal.publishButton.defaultLabel"
          defaultMessage="Save changes"
        />
      );
    }
    return (
      <Modal { ...this.props } ref="modal">
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
              disabled={ this.state.isUpdating || this.state.isDeleting }
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
            onClick={ () => this.refs.modal.hide() }
            disabled={ this.state.isUpdating || this.state.isDeleting }>
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
            disabled={ this.state.isUpdating || this.state.isUploading || this.state.isDeleting }>
            { submitLabel }
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateShout);
