import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { isRtl } from '../reducers/i18n';

import Icon from '../widgets/Icon.js';

import FormattedCreatedAt from '../utils/FormattedCreatedAt';
import { backgroundImageStyle } from '../utils/DOMUtils';

import ConversationDropdown from '../chat/ConversationDropdown';

import './ConversationItem.scss';

export class ConversationItem extends Component {

  static propTypes = {
    conversation: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    selected: PropTypes.bool,
    unread: PropTypes.bool,
    showDropdown: PropTypes.bool,
    isRtl: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  state = {
    hover: false,
  }

  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e, this.props.conversation);
    }
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
    const { conversation, selected, showDropdown } = this.props;

    const className = classNames('ConversationItem', {
      isSelected: selected,
      hover: this.state.hover,
      isUnread: conversation.unreadMessagesCount > 0,
    });

    let conversationUrl;
    if (conversation.type === 'public_chat') {
      conversationUrl = `/chat/${conversation.id}`;
    } else {
      conversationUrl = `/messages/${conversation.id}`;
    }
    return (
      <div
        className={ className }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }>
        <Link onClick={ this.handleClick } to={ conversationUrl }>
          <div
            className="ConversationItem-image"
            style={ backgroundImageStyle({ url: conversation.display.image, variation: 'small', usePlaceholder: false }) }
          />
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
            { showDropdown && !this.state.hover && conversation.unreadMessagesCount > 0 &&
              <div className="ConversationItem-unread-count">
                <FormattedMessage
                  id="conversation.unreadCount"
                  defaultMessage="{count, number} new"
                  values={ { count: conversation.unreadMessagesCount } }
                />
              </div>
            }
          </div>
        </Link>

        { showDropdown && this.state.hover &&
          <ConversationDropdown
            skipItems={ ['linkToConversation'] }
            conversation={ conversation }
            size="small"
            toggle={ <Icon name="cog" hover size="x-small" /> }
            pullRight={ !this.props.isRtl }
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isRtl: isRtl(state),
});

export default connect(mapStateToProps)(ConversationItem);
