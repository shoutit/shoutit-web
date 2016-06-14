import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';

import Modal, { Header, Body, Footer } from '../ui/Modal';

import Button from '../ui/Button';

import { createShout, amendShout } from '../actions/shouts';
import { openModal } from '../actions/ui';

import ShoutForm from './ShoutForm';
import CreateShoutSuccessModal from './CreateShoutSuccessModal';
import { getLoggedUser } from '../reducers/session';

if (process.env.BROWSER) {
  require('./CreateShoutModal.scss');
}

export class CreateShoutModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    shout: PropTypes.object.isRequired,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.createShout = this.createShout.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    isUploading: false,
  }

  componentDidMount() {
    this.refs.cancel.focus();
  }

  componentWillUnmount() {
    this.amendShout({
      createError: null,
    });
  }

  amendShout(data) {
    const { dispatch, shout } = this.props;
    dispatch(amendShout(shout, data));
  }

  createShout() {
    const { dispatch, shout, loggedUser } = this.props;

    if (shout.isCreating || this.state.isUploading) {
      return;
    }
    dispatch(createShout(loggedUser, shout)).then(payload => {
      const shoutId = payload.result;
      this.showNextSteps(shoutId);
      dispatch(push(`/shout/${shoutId}`));
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
    const { shout, error } = this.props;
    const { isUploading } = this.state;
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
    if (shout.isCreating) {
      submitLabel = (<FormattedMessage
        id="createShoutModal.publishButton.publishing"
        defaultMessage="Publishing…"
      />);
    }
    return (
      <Modal { ...this.props} ref="modal" preventClose>
        <Header>
          Post a new { shout.type }
        </Header>
        <Body>
          <div className="CreateShoutModal">
            <div style={ { marginBottom: '1rem' } }>
              <ShoutForm
                inputRef={ form => { this.form = form; } }
                disabled={ shout.isCreating }
                shout={ shout }
                error={ error }
                onChange={ data => this.amendShout({ ...data, createError: null }) }
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
            size="small"
            key="cancel"
            type="button"
            onClick={ this.hide }
            disabled={ shout.isCreating }>
            <FormattedMessage
              id="createShoutModal.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>

          <Button
            onClick={ () => this.form.submit() }
            size="small"
            key="submit"
            action="primary"
            disabled={ shout.isCreating || isUploading }>
            { submitLabel }
          </Button>

        </Footer>
      </Modal>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state;
  const loggedUser = getLoggedUser(state);
  const shout = { ...ownProps.shout, ...entities.shouts[ownProps.shout.id] };
  return {
    shout,
    loggedUser,
    error: shout.createError,
  };
};

export default connect(mapStateToProps)(CreateShoutModal);
