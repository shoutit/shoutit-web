import React from 'react';
import {Col} from 'react-bootstrap';

import MessagesTitle from './MessagesTitle.jsx';
import MessagesList from './MessagesList.jsx';
import MessageReplyForm from './MessageReplyForm.jsx';

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
            messages={ conversation.messages }
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
