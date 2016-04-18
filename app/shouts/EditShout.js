import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import { updateShout, amendShout } from '../actions/shouts';

import ShoutForm from './ShoutForm';

export class EditShout extends Component {

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
    return (
      <div className="EditShout">
        <ShoutForm
          mode="update"
          disabled={ shout.isUpdating }
          shout={ shout }
          error={ shout.updateError }
          onSubmit={ this.updateShout }
          onUploadStart={ () => this.setState({ isUploading: true })}
          onUploadEnd={ () => this.setState({ isUploading: false })}
          actions={[
            <Button type="button" label="Cancel" onClick={ onCancel } disabled={ shout.isUpdating } />,
            <Button primary style={{ minWidth: '10rem' }} label={ submitLabel } disabled={ shout.isUpdating || isUploading } />,
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    shout: state.entities.shouts[ownProps.shoutId],
  };
};

export default connect(mapStateToProps)(EditShout);
