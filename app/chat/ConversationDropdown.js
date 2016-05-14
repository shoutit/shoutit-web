import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import { leave, read, unread } from '../actions/conversations';

import Icon from '../ui/Icon';
import Dropdown, { MenuItem } from '../ui/Dropdown';

export class ConversationDropdown extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['small']),
    skipItems: PropTypes.arrayOf(PropTypes.oneOf(['linkToConversation', 'toggleRead'])),
    conversation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    skipItems: [],
  }

  handleToggleReadClick() {
    const { conversation, dispatch } = this.props;
    if (this.props.conversation.unreadMessagesCount > 0) {
      dispatch(read(conversation));
    } else {
      dispatch(unread(conversation));
    }
  }

  handleLeaveClick() {
    const { conversation, dispatch } = this.props;
    if (confirm('Do you really want to leave this conversation?')) { // eslint-disable-line
      dispatch(leave(conversation));
    }
  }

  render() {
    const { conversation, skipItems } = this.props;
    return (
      <Dropdown toggle={ <Icon name="cog" hover size={ this.props.size } /> } {...this.props}>
        { !skipItems.includes('linkToConversation') &&
          <LinkContainer to={ `/messages/${conversation.id}` }>
            <MenuItem>
              See full conversation
            </MenuItem>
          </LinkContainer>
        }
        { !skipItems.includes('toggleRead') &&
          <MenuItem onSelect={ this.handleToggleReadClick.bind(this) }>
            { conversation.unreadMessagesCount > 0 ? 'Mark as read' : 'Mark as unread' }
          </MenuItem>
        }
        <MenuItem onSelect={ this.handleLeaveClick.bind(this) }>
          Leave conversation
        </MenuItem>
      </Dropdown>
    );
  }

}

export default connect()(ConversationDropdown);
