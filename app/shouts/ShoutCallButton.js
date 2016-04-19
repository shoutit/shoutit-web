import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import RequiresLogin from '../auth/RequiresLogin';
import { REVEAL_NUMBER } from '../auth/loginActions';

import { call } from '../actions/shouts';

export class ShoutCallButton extends Component {

  static propTypes = {
    shout: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    tooltipPlacement: PropTypes.string,
  };

  static defaultProps = {
    tooltipPlacement: 'top',
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.dispatch(call(this.props.shout));
  }

  render() {
    const { shout, tooltipPlacement } = this.props;
    let label = `Call ${shout.mobileHint.replace('...', '…')}`;
    if (shout.isUpdating) {
      label = 'Please wait…';
    }
    if (shout.mobile) {
      label = <a href={`tel://${shout.mobile}`}>{ shout.mobile }</a>;
    }

    const button = (
      <RequiresLogin event="onClick" loginAction={ REVEAL_NUMBER }>
        <Button
          { ...this.props }
          secondary
          disabled={ shout.isUpdating }
          size="small"
          onClick={ !shout.mobile && !shout.isUpdating ? this.handleClick : null }
          leftIcon = { <Icon fill name="phone" /> }
          label={ label }
        />
      </RequiresLogin>
    );

    if (!shout.mobile && !shout.isUpdating) {
      return (
        <Tooltip placement={ tooltipPlacement } overlay="Click to reveal">
          { button }
        </Tooltip>
      );
    }
    return button;
  }

}

export default connect()(ShoutCallButton);
