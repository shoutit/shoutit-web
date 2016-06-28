/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Modal, { Header, Footer, Body } from '../ui/Modal';
import Button from '../ui/Button';

import { updateShout, deleteShout } from '../actions/shouts';
import { getShout } from '../reducers/entities/shouts';

import ShoutForm from './ShoutForm';

import './CreateShoutModal.scss';

export class UpdateShout extends Component {

  static propTypes = {
    shoutId: PropTypes.string.isRequired,
    shout: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.updateShout = this.updateShout.bind(this);
    this.deleteShout = this.deleteShout.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.hide = this.hide.bind(this);

    this.state = {
      isUploading: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      shout: props.shout,
    };
  }

  componentDidMount() {
    this.refs.submit.focus();
  }

  hide() {
    this.refs.modal.hide();
  }

  updateShout() {
    if (this.state.isUpdating || this.state.isUploading || this.state.isDeleting) {
      return;
    }
    this.setState({ isUpdating: true });
    const { dispatch } = this.props;
    dispatch(updateShout(this.state.shout))
      .then(this.hide)
      .catch(error => {
        this.setState({
          error,
          isUpdating: false,
        });
      });
  }

  deleteShout() {
    const { shout, dispatch } = this.props;
    if (confirm('Really delete this Shout?')) { // eslint-disable-line
      this.setState({ isDeleting: true });
      dispatch(deleteShout(shout)).then(() => { window.location = '/'; });
    }
  }
  handleFormChange(data) {
    this.setState({ shout: { ...this.state.shout, ...data } });
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
              onChange={ this.handleFormChange }
              inputRef={ form => { this.form = form; } }
              mode="update"
              disabled={ this.state.isUpdating || this.state.isDeleting }
              shout={ this.state.shout }
              error={ this.state.error }
              onSubmit={ this.updateShout }
              onUploadStart={ () => this.setState({ isUploading: true }) }
              onUploadEnd={ () => this.setState({ isUploading: false }) }
            />
          </div>
        </Body>
        <Footer start={
          <Button
            kind="destructive"
            type="button"
            onClick={ this.deleteShout }
            disabled={ this.state.isUpdating || this.state.isDeleting }
          >
            <FormattedMessage
              id="updateShoutModal.publishButton.deleteButton"
              defaultMessage="Delete"
            />
          </Button>
        }>
          <Button
            key="cancel"
            type="button"
            onClick={ this.hide }
            disabled={ this.state.isUpdating || this.state.isDeleting }
            >
            <FormattedMessage
              id="updateShoutModal.publishButton.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>
          <Button
            ref="submit"
            key="submit"
            kind="primary"
            onClick={ () => this.form.submit() }
            disabled={ this.state.isUpdating || this.state.isUploading || this.state.isDeleting }
          >
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


export default connect(mapStateToProps)(UpdateShout);
