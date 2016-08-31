import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import { leaveConversation, readConversation, unreadConversation } from '../actions/conversations';
import { confirm } from '../actions/ui';

import Icon from '../widgets/Icon';
import Dropdown, { MenuItem } from '../widgets/Dropdown';

const MESSAGES = defineMessages({
  header: {
    id: 'chat.conversation.leaveModal.title',
    defaultMessage: 'Leave this conversation?',
  },
  body: {
    id: 'chat.conversation.leaveModal.message',
    defaultMessage: 'By leaving this conversation, it won\'t be visible from your messages anymore.',
  },
  leave: {
    id: 'chat.conversation.leaveModal.confirmButton',
    defaultMessage: 'Leave',
  },
  cancel: {
    id: 'chat.conversation.leaveModal.cancelButton',
    defaultMessage: 'Cancel',
  },
});

export class ConversationDropdown extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['small']),
    skipItems: PropTypes.arrayOf(PropTypes.oneOf(['linkToConversation', 'toggleRead'])),
    conversation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    readConversation: PropTypes.func.isRequired,
    unreadConversation: PropTypes.func.isRequired,
    leaveConversation: PropTypes.func.isRequired,
  }

  static defaultProps = {
    skipItems: [],
  }

  handleToggleReadClick() {
    const { conversation, readConversation, unreadConversation } = this.props;

    if (conversation.unreadMessagesCount > 0) {
      readConversation(conversation);
    } else {
      unreadConversation(conversation);
    }
  }

  handleLeaveClick() {
    const { conversation, intl: { formatMessage }, confirm, leaveConversation } = this.props;

    confirm(
      formatMessage(MESSAGES.header),
      formatMessage(MESSAGES.body),
      [
        {
          label: formatMessage(MESSAGES.cancel),
          focused: true,
        },
        {
          label: formatMessage(MESSAGES.leave),
          kind: 'destructive',
          action: modal => {
            modal.hide();
            leaveConversation(conversation);
          },
        },
      ]
    );
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

const mapDispatchToProps = dispatch => bindActionCreators({
  confirm,
  readConversation,
  unreadConversation,
  leaveConversation,
}, dispatch);

export default connect(null, mapDispatchToProps)(injectIntl(ConversationDropdown));
