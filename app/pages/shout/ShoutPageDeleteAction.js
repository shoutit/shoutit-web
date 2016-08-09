/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import { openModal } from '../../actions/ui';
import { deleteShout } from '../../actions/shouts';

import GenericModal from '../../modals/GenericModal';

import './ShoutPageDeleteAction.scss';

const MESSAGES = defineMessages({
  buttonLabel: {
    id: 'shoutPageDeleteAction.button.label',
    defaultMessage: 'Delete',
  },
  header: {
    id: 'shoutPageDeleteAction.modal.header',
    defaultMessage: 'Do you want to delete this Shout?',
  },
  body: {
    id: 'shoutPageDeleteAction.modal.body',
    defaultMessage: 'This shout will be removed permanently.',
  },
  confirm: {
    id: 'shoutPageDeleteAction.modal.button.confirm',
    defaultMessage: 'Delete Shout',
  },
  cancel: {
    id: 'shoutPageDeleteAction.modal.button.cancel',
    defaultMessage: 'Cancel',
  },
});

class ShoutPageDeleteAction extends Component {
  static propTypes = {
    shout: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    onDeleteConfirm: PropTypes.func.isRequired,
  }

  constructor() {
    super();

    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    const { openModal, shout, onDeleteConfirm, intl } = this.props;

    openModal(
      <GenericModal
        header={ intl.formatMessage(MESSAGES.header) }
        buttons={ [
          {
            label: intl.formatMessage(MESSAGES.cancel),
            focused: true,
          },
          {
            label: intl.formatMessage(MESSAGES.confirm),
            kind: 'destructive',
            onClick: () => onDeleteConfirm(shout),
          },
        ] }
      >
        { intl.formatMessage(MESSAGES.body) }
      </GenericModal>
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <div className="ShoutPageDeleteAction">
        <a onClick={ this.onClickHandler }>
          { intl.formatMessage(MESSAGES.buttonLabel) }
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  openModal: modal => dispatch(openModal(modal)),
  onDeleteConfirm: shout =>
    dispatch(deleteShout(shout)).then(() => { window.location = '/'; }),
});

export default connect(undefined, mapDispatchToProps)(injectIntl(ShoutPageDeleteAction));
