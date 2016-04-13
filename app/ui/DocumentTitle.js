import React, { PropTypes } from 'react';
import ReactDocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

export function DocumentTitle({ title, badge = 0, children, showBadge = true }) {

  if (!title) {
    title = 'shoutit';
  } else {
    title = `${title} – Shoutit`;
  }

  if (showBadge && badge) {
    title = `(${badge}) ${title}`;
  }

  return <ReactDocumentTitle title={ title }>{children}</ReactDocumentTitle>;
}

DocumentTitle.propTypes = {
  title: PropTypes.string,
  badge: PropTypes.number,
  children: PropTypes.element.isRequired,
  showBadge: PropTypes.bool,
};

const mapStateToProps = state => ({
  badge: state.session.user ? state.session.user.stats.unreadConversationsCount : 0,
});

export default connect(mapStateToProps)(DocumentTitle);
