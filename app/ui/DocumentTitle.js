import React from 'react';
import ReactDocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

export function DocumentTitle({ title, badge = 0, children }) {

  if (!title) {
    title = 'shoutit';
  } else {
    title = `${title} – Shoutit`;
  }

  if (badge) {
    title = `(${badge}) ${title}`;
  }

  return <ReactDocumentTitle title={ title }>{children}</ReactDocumentTitle>;
}

const mapStateToProps = state => ({
  badge: state.session.user ? state.session.user.stats.unreadConversationsCount : 0,
});

export default connect(mapStateToProps)(DocumentTitle);
