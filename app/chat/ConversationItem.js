import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import ProfileAvatar from '../users/ProfileAvatar.js';
import Icon from '../ui/Icon.js';

import { formatCreatedAt } from '../utils/DateUtils';
import ConversationDropdown from '../chat/ConversationDropdown';

if (process.env.BROWSER) {
  require('./ConversationItem.scss');
}

export default class ConversationItem extends Component {

  static propTypes = {
    conversation: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
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

    const { id, profiles, lastMessage, unreadMessagesCount } = conversation;

    const partecipants = profiles.filter(profile => !profile.isOwner);
    let className = 'ConversationItem';
    if (selected) {
      className = `${className} is-selected`;
    }
    if (hover) {
      className = `${className} hover`;
    }
    if (unreadMessagesCount > 0) {
      className = `${className} is-unread`;
    }

    const head = conversation.profiles.filter(profile => !profile.isOwner)
        .map(profile => profile.name).join(', ');
    return (
      <div
        className={ className }
        onMouseEnter={ this.handleMouseEnter.bind(this) }
        onMouseLeave={ this.handleMouseLeave.bind(this) }
      >
        <Link onClick={ onClick } to={ `/messages/${id}` }>
          <div className="ConversationItem-image">
            <ProfileAvatar profile={ partecipants[0] } size="large" />
          </div>
          <div className="ConversationItem-content">
            <div className="ConversationItem-head">
              { head }
            </div>
            { conversation.type === 'about_shout' &&
              <div className="ConversationItem-about">
                { conversation.about.title }
              </div>
            }
            { lastMessage &&
              <div className="ConversationItem-last" title={ lastMessage.text }>
                { lastMessage.profile && lastMessage.profile.isOwner &&
                  <Icon name={ lastMessage.readBy ? 'ok' : 'reply' } size="x-small" /> }
                { lastMessage.text &&
                  <span>{ lastMessage.text }</span> }
                { !lastMessage.text && lastMessage.attachments &&
                  <span className="htmlAncillary">Sent an attachment</span> }
              </div>
            }
          </div>
          <div className="ConversationItem-tools">
            { lastMessage &&
              <div className="ConversationItem-date">
                { formatCreatedAt(lastMessage.createdAt) }
              </div>
            }
            { showDropdown && !hover && unreadMessagesCount > 0 &&
              <div className="ConversationItem-unread-count">
                { unreadMessagesCount } new
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
      </div>
    );
  }
}
