/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import { deleteShout } from '../../actions/shouts';

import { confirm } from '../../modals';

import './ShoutPageDeleteAction.scss';

const MESSAGES = defineMessages({
  buttonLabel: {
    id: 'shoutPage.DeleteAction.button.label',
    defaultMessage: 'Delete Shout',
  },
  header: {
    id: 'shoutPage.DeleteAction.modal.header',
    defaultMessage: 'Do you want to delete this Shout?',
  },
  body: {
    id: 'shoutPage.DeleteAction.modal.body',
    defaultMessage: 'This shout will be removed permanently.',
  },
  confirm: {
    id: 'shoutPage.DeleteAction.modal.button.confirm',
    defaultMessage: 'Delete Shout',
  },
  cancel: {
    id: 'shoutPage.DeleteAction.modal.button.cancel',
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

    confirm(
      intl.formatMessage(MESSAGES.header),
      intl.formatMessage(MESSAGES.body),
      [
        {
          label: intl.formatMessage(MESSAGES.cancel),
          focused: true,
        },
        {
          label: intl.formatMessage(MESSAGES.confirm),
          kind: 'destructive',
          onClick: () => {
            deleteShout(shout)
              .then(() => { window.location = '/'; });
          },
        },
      ]
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
