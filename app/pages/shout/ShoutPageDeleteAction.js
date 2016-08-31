/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import { deleteShout } from '../../actions/shouts';

import { confirm } from '../../actions/ui';

import './ShoutPageDeleteAction.scss';

const MESSAGES = defineMessages({
  buttonLabel: {
    id: 'shoutPage.deleteShout.label',
    defaultMessage: 'Delete Shout',
  },
  header: {
    id: 'shoutPage.deleteShout.confirm.title',
    defaultMessage: 'Do you want to delete this Shout?',
  },
  body: {
    id: 'shoutPage.deleteShout.confirm.message',
    defaultMessage: 'This shout will be removed permanently.',
  },
  confirm: {
    id: 'shoutPage.deleteShout.confirm.confirmButton',
    defaultMessage: 'Delete Shout',
  },
  cancel: {
    id: 'shoutPage.deleteShout.confirm.cancelButton',
    defaultMessage: 'Cancel',
  },
});

class ShoutPageDeleteAction extends Component {
  static propTypes = {
    shout: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    deleteShout: PropTypes.func.isRequired,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { confirm, shout, deleteShout, intl } = this.props;

    const buttons = [
      {
        label: intl.formatMessage(MESSAGES.cancel),
        focused: true,
        action: 'cancel',
      },
      {
        label: intl.formatMessage(MESSAGES.confirm),
        kind: 'destructive',
        action: modal => {
          modal.submit();
          deleteShout(shout).then(() => window.location = '/');
        },
      },
    ];

    confirm(
      intl.formatMessage(MESSAGES.header),
      intl.formatMessage(MESSAGES.body),
      buttons,
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <div className="ShoutPageDeleteAction">
        <a onClick={ this.handleClick }>
          { intl.formatMessage(MESSAGES.buttonLabel) }
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteShout,
  confirm,
}, dispatch);

export default connect(undefined, mapDispatchToProps)(injectIntl(ShoutPageDeleteAction));
