import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import { updateShout, deleteShout, amendShout } from '../actions/shouts';

import ShoutForm from './ShoutForm';

if (process.env.BROWSER) {
  require('./CreateShout.scss');
}

export class UpdateShout extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    shout: PropTypes.object.isRequired,
    shoutId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.updateShout = this.updateShout.bind(this);
    this.deleteShout = this.deleteShout.bind(this);
  }

  state = {
    isUploading: false,
  }

  componentWillUnmount() {
    const { dispatch, shout } = this.props;
    dispatch(amendShout(shout, { updateError: null }));
  }

  updateShout(shout) {
    if (shout.isUpdating || this.state.isUploading) {
      return;
    }

    const { dispatch, onSuccess } = this.props;
    shout = {
      ...this.props.shout,
      ...shout,
    };

    dispatch(updateShout(shout)).then(onSuccess);
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
    const { shout, onCancel } = this.props;
    const { isUploading } = this.state;
    let submitLabel = 'Publish';
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
      <div className="CreateShout">
        <h1>Update { shout.type }</h1>
        <ShoutForm
          mode="update"
          disabled={ shout.isUpdating || shout.isDeleting }
          shout={ shout }
          error={ shout.updateError }
          onSubmit={ this.updateShout }
          onUploadStart={ () => this.setState({ isUploading: true })}
          onUploadEnd={ () => this.setState({ isUploading: false })}
          actions={[
            <Button type="button" label="Cancel" onClick={ onCancel } disabled={ shout.isUpdating || shout.isDeleting } />,
            <Button primary style={{ minWidth: '10rem' }} label={ submitLabel } disabled={ shout.isUpdating || isUploading || shout.isDeleting } />,
          ]}
        />
        <div className="CreateShout-delete">
          <Button destructive size="small" label="Delete" disabled={ shout.isDeleting } onClick={ this.deleteShout } />
          <span className="htmlAncillary" style={{ fontSize: '.75rem' }}>
            { ' ' } – will delete this Shout permanently
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    shout: state.entities.shouts[ownProps.shoutId],
  };
};

export default connect(mapStateToProps)(UpdateShout);
