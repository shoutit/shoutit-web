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
import { getLoggedUser } from '../reducers/session';
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
    isCreating: false,
    error: null,
  }

  componentDidMount() {
    this.refs.cancel.focus();
  }

  getStateFromProps(props) {
    return {
      shout: props.shout,
    };
  }

  handleSubmit() {
    if (this.state.isCreating || this.state.isUploading) {
      return;
    }
    this.setState({ isCreating: true });
    this.props.onSubmit(this.props.loggedUser, this.state.shout)
      .then(payload => this.props.onCreateSuccess(payload.result))
      .catch(error => this.setState({
        isCreating: false,
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
    this.refs.modal.hide();
  }

  render() {
    const { isUploading, isCreating, error } = this.state;
    let submitLabel = (<FormattedMessage
      id="createShoutModal.publishButton.defaultLabel"
      defaultMessage="Publish"
    />);
    if (isUploading) {
      submitLabel = (<FormattedMessage
        id="createShoutModal.publishButton.uploadingImages"
        defaultMessage="Uploading…"
      />);
    }
    return (
      <Modal { ...this.props } ref="modal" preventClose>
        <Header>
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
                disabled={ isCreating }
                shout={ this.state.shout }
                error={ error }
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
            ref="cancel"
            key="cancel"
            type="button"
            onClick={ this.hide }
            disabled={ isCreating }>
            <FormattedMessage
              id="createShoutModal.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>

          <Button
            onClick={ this.handleSubmit }
            key="submit"
            kind="primary"
            disabled={ isCreating || isUploading }>
            { submitLabel }
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
  loggedUser: getLoggedUser(state),
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
