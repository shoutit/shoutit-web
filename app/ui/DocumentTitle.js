import React from 'react';
import ReactDocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

export function DocumentTitle({ title, unreadConversations = 0, children }) {

  if (!title) {
    title = 'shoutit';
  } else {
    title = `${title} – shoutit`;
  }

  if (unreadConversations) {
    title = `(${unreadConversations}) ${title}`;
  }

  return <ReactDocumentTitle title={ title }>{children}</ReactDocumentTitle>;
}

function mapStateToProps(state) {
  const { paginated, entities } = state;
  const conversations = paginated.chat.ids.map(id => entities.conversations[id]);
  const unreadConversations = conversations.filter(c => c.unreadMessagesCount > 0).length;
  return {
    unreadConversations
  };
}

export default connect(mapStateToProps)(DocumentTitle);
