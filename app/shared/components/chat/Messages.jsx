import React, { Component, PropTypes } from 'react';

import MessagesTitle from '../chat/MessagesTitle.jsx';
import MessagesList from '../chat/MessagesList.jsx';
import MessageReplyForm from '../chat/MessageReplyForm.jsx';

/**
 * Component to show messages in a conversation, contains a reply form.
 * @param {Object} props.conversation
 * @param {Boolean} props.loading
 * @param {String} props.me
 * @param {Object} props.draft
 * @param {Function} props.onLoadMoreMessagesClick
 * @param {Function} props.onReplyTextChange
 * @param {Function} props.onReplySubmit
 */

export default class Messages extends Component {

  static propTypes = {
    conversation: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    me: PropTypes.string.isRequired,
    lastMessageId: PropTypes.string.isRequired,
    draft: PropTypes.object,
    onRequestToLoadMoreMessages: PropTypes.func,
    onReplySubmit: PropTypes.func,
    onReplyTextChange: PropTypes.func
  }

  static defaultProps = {
    loading: false
  }

  componentDidMount() {
    this.scrollListToBottom();
  }

  componentDidUpdate(prevProps) {
    // Scroll to bottom if showing another conversation or if the current conversation
    // got a new message
    if (prevProps.conversation !== this.props.conversation
      || prevProps.lastMessageId !== this.props.lastMessageId) {
      this.scrollListToBottom();
    }

    // TODO: listen to scroll to load previous messages
  }

  scrollListToBottom() {
    const { list } = this.refs;
    list.scrollTop = list.scrollHeight;
  }

  render() {

    const {
      conversation,
      loading,
      me,
      draft,
      onRequestToLoadMoreMessages,
      onReplyTextChange,
      onReplySubmit
    } = this.props;

    return (
      <div className="Messages">
        <MessagesTitle conversation={ conversation } me={ me } />
        <div className="Messages-listContainer" ref="list">
          <div className="Messages-listTopSeparator" />
          { !loading && <MessagesList
              me={ me }
              conversation={ conversation }
              onLoadMoreMessagesClick={ onRequestToLoadMoreMessages }
            />
          }
        </div>
        <div className="Messages-replyFormContainer">
          <MessageReplyForm
            autoFocus
            draft={ draft }
            onTextChange={ onReplyTextChange }
            onSubmit={ onReplySubmit }
          />
        </div>
      </div>

    );
  }

}
