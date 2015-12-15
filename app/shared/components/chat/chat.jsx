import React from 'react';

import { Col } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';

import Conversations from './conversations/Conversations.jsx';

export default function({ children, params }) {
  return (
    <DocumentTitle title="Chats - Shoutit">
      <div className="chat">
        <Col xs={12} md={4} className="chat-left-padding">
          <Conversations chatId={ params.chatId } />
        </Col>
        <Col xs={12} md={8} className="chat-left-padding">
          { children }
        </Col>
      </div>
    </DocumentTitle>
  );

}
