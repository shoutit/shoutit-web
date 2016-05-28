import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Modal, { Header, Footer, Body } from '../ui/Modal';
import Button from '../ui/Button';

import { updateShout, deleteShout, amendShout } from '../actions/shouts';

import ShoutForm from './ShoutForm';

if (process.env.BROWSER) {
  require('./CreateShoutModal.scss');
}

export class UpdateShout extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    shout: PropTypes.object.isRequired,
    shoutId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.updateShout = this.updateShout.bind(this);
    this.deleteShout = this.deleteShout.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    isUploading: false,
  }

  componentDidMount() {
    this.refs.cancel.focus();
  }

  componentWillUnmount() {
    const { dispatch, shout } = this.props;
    dispatch(amendShout(shout, { updateError: null }));
  }

  hide() {
    this.refs.modal.hide();
  }

  updateShout(shout) {
    if (shout.isUpdating || this.state.isUploading) {
      return;
    }

    const { dispatch } = this.props;
    shout = {
      ...this.props.shout,
      ...shout,
    };

    dispatch(updateShout(shout)).then(this.hide);
  }

  deleteShout() {
    const { shout, dispatch } = this.props;
    if (confirm('Really delete this Shout?')) { // eslint-disable-line
      dispatch(deleteShout(shout)).then(() => {
        window.location = '/';
      });
    }
  }

  render() {
    const { shout, ...modalProps } = this.props;
    const { isUploading } = this.state;
    let submitLabel = 'Save changes';
    if (isUploading) {
      submitLabel = 'Uploading…';
    }
    if (shout.isUpdating) {
      submitLabel = 'Publishing…';
    }
    if (shout.isDeleting) {
      submitLabel = 'Deleting…';
    }
    return (
      <Modal { ...modalProps } ref="modal">
        <Header closeButton>
          Edit Shout
        </Header>
        <Body>
          <div className="CreateShoutModal">
            <ShoutForm
              inputRef={ form => { this.form = form; } }
              mode="update"
              disabled={ shout.isUpdating || shout.isDeleting }
              shout={ shout }
              error={ shout.updateError }
              onSubmit={ this.updateShout }
              onUploadStart={ () => this.setState({ isUploading: true }) }
              onUploadEnd={ () => this.setState({ isUploading: false }) }
            />
          </div>
        </Body>
        <Footer>
          <span style={ { float: 'left' } }>
            <Button action="destructive" size="small" type="button" onClick={ this.deleteShout } disabled={ shout.isUpdating || shout.isDeleting }>
              Delete
            </Button>
          </span>
          <span style={ { marginRight: '.5rem' } }>
            <Button key="cancel" size="small" type="button" onClick={ this.hide } disabled={ shout.isUpdating || shout.isDeleting }>
              Cancel
            </Button>
          </span>
          <Button key="submit" size="small" action="primary" onClick={ () => this.form.submit() } disabled={ shout.isUpdating || isUploading || shout.isDeleting }>
            { submitLabel }
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    shout: state.entities.shouts[ownProps.shoutId],
  };
};

export default connect(mapStateToProps)(UpdateShout);
