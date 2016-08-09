import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import { leaveConversation, readConversation, unreadConversation } from '../actions/conversations';
import { openModal } from '../actions/ui';

import Icon from '../widgets/Icon';
import Dropdown, { MenuItem } from '../widgets/Dropdown';

import SimpleModal from '../modals/SimpleModal';

const MESSAGES = defineMessages({
  header: {
    id: 'chat.conversation.leaveModal.header',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'chat.conversation.leaveModal.body',
    defaultMessage: 'Do you really want to leave this conversation?',
  },
  leave: {
    id: 'shoutPageDeleteAction.leaveModal.leave',
    defaultMessage: 'Leave',
  },
  cancel: {
    id: 'chat.conversation.leaveModal.cancel',
    defaultMessage: 'Cancel',
  },
});

export class ConversationDropdown extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['small']),
    skipItems: PropTypes.arrayOf(PropTypes.oneOf(['linkToConversation', 'toggleRead'])),
    conversation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    skipItems: [],
  }

  handleToggleReadClick() {
    const { conversation, dispatch } = this.props;
    if (this.props.conversation.unreadMessagesCount > 0) {
      dispatch(readConversation(conversation));
    } else {
      dispatch(unreadConversation(conversation));
    }
  }

  handleLeaveClick() {
    const { conversation, dispatch, intl: { formatMessage } } = this.props;

    dispatch(openModal(
      <SimpleModal
        header={ formatMessage(MESSAGES.header) }
        buttons={ [
          { label: formatMessage(MESSAGES.cancel) },
          {
            label: formatMessage(MESSAGES.leave),
            kind: 'primary',
            onClick: () => dispatch(leaveConversation(conversation)),
          },
        ] }
      >
        { formatMessage(MESSAGES.body) }
      </SimpleModal>
    ));
  }

  render() {
    const { conversation, skipItems } = this.props;
    return (
      <Dropdown toggle={ <Icon name="cog" hover size={ this.props.size } /> } { ...this.props }>
        { !skipItems.includes('linkToConversation') &&
          <LinkContainer to={ `/messages/${conversation.id}` }>
            <MenuItem>
              <FormattedMessage id="chat.conversation.dropdown.fullConversation" defaultMessage="See full conversation." />
            </MenuItem>
          </LinkContainer>
        }
        { !skipItems.includes('toggleRead') &&
          <MenuItem onSelect={ this.handleToggleReadClick.bind(this) }>
            { conversation.unreadMessagesCount > 0 ?
              <FormattedMessage id="chat.conversation.dropdown.read" defaultMessage="Mark as read." /> :
              <FormattedMessage id="chat.conversation.dropdown.unread" defaultMessage="Mark as unread." />
            }
          </MenuItem>
        }
        <MenuItem onSelect={ this.handleLeaveClick.bind(this) }>
          <FormattedMessage id="chat.conversation.dropdown.leaveConversation" defaultMessage="Leave this conversation." />
        </MenuItem>
      </Dropdown>
    );
  }
}

export default connect()(injectIntl(ConversationDropdown));
