import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Conversation from './Conversation';
import { getConversationName } from './ChatUtils';
import { closeConversation } from '../actions/chat';
import { denormalize } from '../schemas';

if (process.env.BROWSER) {
  require('./HostedConversation.scss');
}

export class HostedConversation extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    loggedUser: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const { onCloseClick, conversation, loggedUser, onClick } = this.props;
    return (
      <div className="HostedConversation" onClick={ onClick }>
        <div className="HostedConversation-header">
          <h3>
            { getConversationName(conversation, loggedUser) }
          </h3>
          <span tabIndex={0} className="HostedConversation-close" onClick={ onCloseClick }>✕</span>
        </div>
        <div className="HostedConversation-conversation">
          <Conversation id={ conversation.id } />
        </div>
      </div>
    );
  }
}

HostedConversation.propTypes = {
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func.isRequired,
  conversation: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  loggedUser: state.session.user,
  conversation: denormalize(state.entities.conversations[ownProps.id], state.entities, 'CONVERSATION'),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseClick: () => dispatch(closeConversation(ownProps.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HostedConversation);
