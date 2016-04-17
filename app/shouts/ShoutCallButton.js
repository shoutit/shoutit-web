import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';

import { call } from '../actions/shouts';

export class ShoutCallButton extends Component {

  propTypes = {
    shout: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.dispatch(call(this.props.shout.id));
  }

  render() {
    const { shout } = this.props;
    let label = `Call ${shout.mobileHint.replace('...', '…')}`;
    if (shout.isUpdating) {
      label = 'Please wait…';
    }
    if (shout.mobile) {
      label = shout.mobile;
    }

    const button = (
      <Button
        { ...this.props }
        secondary
        size="small"
        onClick={ !shout.mobile && !shout.isUpdating ? this.handleClick : null }
        leftIcon = { <Icon fill name="phone" /> }
        label={ label }
      />
    );

    if (!shout.mobile && !shout.isUpdating) {
      return (
        <Tooltip placement="right" overlay="Click to reveal">
          { button }
        </Tooltip>
      );
    }
    return button;
  }

}

export default connect()(ShoutCallButton);
