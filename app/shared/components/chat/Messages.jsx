import React from 'react';

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
export default function Messages({
  conversation,
  loading,
  me,
  draft,
  onLoadMoreMessagesClick,
  onReplyTextChange,
  onReplySubmit
}) {

  if (loading) {
    return <div className="Messages">Loading....</div>
  }

  return (
    <div className="Messages">
      <MessagesTitle conversation={ conversation } me={ me } />
      <div className="Messages-listContainer">
        <MessagesList
          me={ me }
          conversation={ conversation }
          onLoadMoreMessagesClick={ onLoadMoreMessagesClick }
        />
      </div>
      <div className="Messages-replyFormContainer">
        <MessageReplyForm
          draft={ draft }
          onTextChange={ onReplyTextChange }
          onSubmit={ onReplySubmit }
        />
      </div>
    </div>

  )

}
