import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { openConversation } from '../actions/conversations';

let ConversationsList;

if (process.env.BROWSER) {
  ConversationsList = require('../chat/ConversationsList.js').default;
  require('../styles/ListOverlay.scss');
}

export class HeaderMessagesOverlay extends Component {
  render() {
    const { onConversationClick, closeOverlay } = this.props;
    return (
      <div className="ListOverlay">
        <div className="ListOverlay-header">
          <span className="ListOverlay-title">
            <FormattedMessage
              id="header.messagesPopover.title"
              defaultMessage="Messages"
            />
          </span>
        </div>
        <div className="ListOverlay-body">
          { ConversationsList && <ConversationsList onConversationClick={ onConversationClick } /> }
        </div>
        <div className="ListOverlay-footer">
          <Link to="/messages" onClick={ () => closeOverlay() }>
            <FormattedMessage
              id="header.messagesPopover.seeAllButton"
              defaultMessage="See All"
            />
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
