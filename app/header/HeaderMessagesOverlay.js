import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { openConversation } from '../actions/chat';

import ConversationsList from '../chat/ConversationsList.js';

if (process.env.BROWSER) {
  require('../styles/ListOverlay.scss');
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

const mapStateToProps = state => ({
  currentUrl: state.routing.currentUrl,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { currentUrl } = stateProps;
  return {
    ...ownProps,
    onConversationClick: (conversation, e) => {
      ownProps.closeOverlay();

      if (currentUrl.indexOf('messages') > -1) {
        // User is already in the messages page, let the link work as usual
        return;
      }
      // otherwise, open the message overlay
      e.preventDefault();
      dispatch(openConversation(conversation));
    },
  };
};

export default connect(mapStateToProps, null, mergeProps)(HeaderMessagesOverlay);
