import React from 'react';
import {Col} from 'react-bootstrap';

import MessagesTitle from './MessagesTitle.jsx';
import MessagesList from './MessagesList.jsx';
import MessageReplyForm from './MessageReplyForm.jsx';

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

  return (
    <Col xs={12} md={12} className="chat-right">
      <MessagesTitle conversation={ conversation } me={ me } />
      { !loading ?
        <div>
          <MessagesList
            me={ me }
            conversation={ conversation }
            onLoadMoreMessagesClick={ onLoadMoreMessagesClick }
          />
          <MessageReplyForm
            draft={ draft }
            onTextChange={ onReplyTextChange }
            onSubmit={ onReplySubmit }
          />
        </div>
        : <p>Loading messages</p>
      }
    </Col>

  )

}
