import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { openConversation } from '../actions/chat';

import ConversationsList from '../chat/ConversationsList.js';

if (process.env.BROWSER) {
  require('../styles/components/ListOverlay.scss');
}
export class HeaderMessagesOverlay extends Component {
  render() {
    const { onConversationClick, closeOverlay } = this.props;
    return (
      <div className="ListOverlay">
        <div className="ListOverlay-header">
          <span className="ListOverlay-title">
            Messages
          </span>
        </div>
        <div className="ListOverlay-body">
          <ConversationsList onConversationClick={ onConversationClick } />
        </div>
        <div className="ListOverlay-footer">
          <Link to="/messages" onClick={ () => closeOverlay() }>
            See All
          </Link>
        </div>
      </div>
    );
  }
}

HeaderMessagesOverlay.propTypes = {
  closeOverlay: PropTypes.func.isRequired,
  onConversationClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onConversationClick: (conversation, e) => {
    e.preventDefault();
    ownProps.closeOverlay();
    dispatch(openConversation(conversation));
  },
});

export default connect(null, mapDispatchToProps)(HeaderMessagesOverlay);
