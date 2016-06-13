import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Icon from '../ui/Icon.js';

import FormattedCreatedAt from '../utils/FormattedCreatedAt';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

import ConversationDropdown from '../chat/ConversationDropdown';

if (process.env.BROWSER) {
  require('./ConversationItem.scss');
}

export default class ConversationItem extends Component {

  static propTypes = {
    conversation: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    selected: PropTypes.bool,
    unread: PropTypes.bool,
    showDropdown: PropTypes.bool,
  };

  state = {
    hover: false,
  }

  handleMouseEnter(e) {
    this.setState({
      hover: true,
    });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  }

  handleMouseLeave(e) {
    this.setState({
      hover: false,
    });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  }

  render() {
    const {
      conversation,
      onClick,
      selected,
      showDropdown,
    } = this.props;

    const { hover } = this.state;

    let className = 'ConversationItem';
    if (selected) {
      className = `${className} is-selected`;
    }
    if (hover) {
      className = `${className} hover`;
    }
    if (conversation.unreadMessagesCount > 0) {
      className = `${className} is-unread`;
    }

    return (
      <li
        className={ className }
        onMouseEnter={ this.handleMouseEnter.bind(this) }
        onMouseLeave={ this.handleMouseLeave.bind(this) }
      >
        <Link onClick={ onClick } to={ `/messages/${conversation.id}` }>
          <div className="ConversationItem-image" style={ getStyleBackgroundImage(conversation.display.image) } />
          <div className="ConversationItem-content">
            { conversation.display.title &&
              <div className="ConversationItem-title">
              { conversation.display.title }
              </div>
            }
            { conversation.display.subTitle &&
              <div className="ConversationItem-subtitle">
                { conversation.display.subTitle }
              </div>
            }
            { conversation.display.lastMessageSummary &&
              <div className="ConversationItem-last" title={ conversation.display.lastMessageSummary }>
                { conversation.display.lastMessageSummary }
              </div>
            }
          </div>
          <div className="ConversationItem-tools">
            <div className="ConversationItem-date">
              <FormattedCreatedAt value={ conversation.modifiedAt } />
            </div>
            { showDropdown && !hover && conversation.unreadMessagesCount > 0 &&
              <div className="ConversationItem-unread-count">
                { conversation.unreadMessagesCount } new
              </div>
            }
          </div>
        </Link>

        { showDropdown && hover &&
          <ConversationDropdown
            skipItems={ ['linkToConversation'] }
            conversation={ conversation }
            size="small"
            toggle={ <Icon name="cog" hover size="x-small" /> }
            pullRight
          />
        }
      </li>
    );
  }
}
