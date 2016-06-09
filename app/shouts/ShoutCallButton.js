import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

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
    this.props.dispatch(call(this.props.shout.id));
  }

  render() {
    const { shout } = this.props;
    let label =
      (<FormattedMessage
        id="shoutCallButton.hint"
        defaultMessage="Call {mobileHint}"
        values={ { mobileHint: shout.mobileHint.replace('...', '…') } }
      />);
    if (shout.isCalling) {
      label = <FormattedMessage id="shoutCallButton.loading" defaultMessage="Please wait…" />;
    }
    if (shout.mobile) {
      label = <a href={ `tel://${shout.mobile}` }>{ shout.mobile }</a>;
    }

    const button = (
      <RequiresLogin event="onClick" loginAction={ REVEAL_NUMBER }>
        <Button
          { ...this.props }
          action="primary-alt"
          disabled={ shout.isCalling }
          size="small"
          onClick={ !shout.mobile && !shout.isCalling ? this.handleClick : null }
          icon="phone">
          { label }
        </Button>
      </RequiresLogin>
    );

    if (!shout.mobile && !shout.isCalling) {
      return (
        <Tooltip overlay={ <FormattedMessage id="shoutCallButton.tooltip" defaultMessage="Click to reveal" /> }>
          { button }
        </Tooltip>
      );
    }
    return button;
  }

}

export default connect()(ShoutCallButton);
