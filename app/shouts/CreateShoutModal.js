import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';

import Modal, { Header, Body, Footer } from '../ui/Modal';

import Button from '../ui/Button';

import { createShout, saveShoutDraft, resetShoutDraft } from '../actions/shouts';
import { openModal } from '../actions/ui';

import ShoutForm from './ShoutForm';
import CreateShoutSuccessModal from './CreateShoutSuccessModal';
import { getLoggedUser } from '../reducers/session';
import { getShoutDraft } from '../reducers/shoutDraft';

import './CreateShoutModal.scss';

export class CreateShoutModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    shout: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.createShout = this.createShout.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    isUploading: false,
    isCreating: false,
    error: null,
  }

  componentDidMount() {
    this.refs.cancel.focus();
  }

  saveShoutDraft(data) {
    const { dispatch } = this.props;
    dispatch(saveShoutDraft(data));
  }

  createShout() {
    const { dispatch, shout, loggedUser } = this.props;

    if (this.state.isCreating || this.state.isUploading) {
      return;
    }
    this.setState({ isCreating: true });
    dispatch(createShout(loggedUser, shout)).then(payload => {
      dispatch(resetShoutDraft());
      const shoutId = payload.result;
      this.showNextSteps(shoutId);
      dispatch(push(`/shout/${shoutId}`));
    }).catch(error => this.setState({
      isCreating: false,
      error,
    }));

  }

  handleFormChange(data) {
    this.saveShoutDraft({
      ...this.props.shout,
      ...data,
    });
    this.setState({
      ...data,
      error: null,
    });
  }

  showNextSteps(shoutId) {
    this.props.dispatch(dispatch => {
      setTimeout(() =>
        dispatch(openModal(<CreateShoutSuccessModal shoutId={ shoutId } />))
      , 1000);
    });
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
                inputRef={ form => { this.form = form; } }
                disabled={ isCreating }
                shout={ this.props.shout }
                error={ error }
                onChange={ data => this.handleFormChange(data) }
                onSubmit={ this.createShout }
                onCancel={ this.hide }
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
            onClick={ () => this.form.submit() }
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

const mapStateToProps = (state, ownProps) => {
  const loggedUser = getLoggedUser(state);
  const shout = {
    ...ownProps.shout,
    ...getShoutDraft(state),
  };
  return {
    shout,
    loggedUser,
  };
};

export default connect(mapStateToProps)(CreateShoutModal);
