import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import { updateShout, amendShout } from '../actions/shouts';

import ShoutForm from './ShoutForm';
//
// if (process.env.BROWSER) {
//   require('./EditShout.scss');
// }

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

  componentWillUnmount() {
    const { dispatch, shout } = this.props;
    dispatch(amendShout(shout, { updateError: null }));
  }

  updateShout(shout) {
    const { dispatch, onSuccess } = this.props;
    shout = {
      ...this.props.shout,
      ...shout,
    };
    if (shout.isUpdating) {
      return;
    }
    dispatch(updateShout(shout)).then(onSuccess);
  }

  render() {
    const { shout, onCancel } = this.props;
    return (
      <div className="EditShout">
        <ShoutForm
          mode="update"
          disabled={ shout.isUpdating }
          shout={ shout }
          error={ shout.updateError }
          onSubmit={ this.updateShout }
          actions={[
            <Button type="button" label="Cancel" onClick={ onCancel } disabled={ shout.isUpdating } />,
            <Button primary label="Publish" disabled={ shout.isUpdating } />,
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
