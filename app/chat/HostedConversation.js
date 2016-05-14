import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Conversation from './Conversation';
import ConversationName from './ConversationName';
import { closeConversation } from '../actions/conversations';
import { denormalize } from '../schemas';

import ConversationDropdown from '../chat/ConversationDropdown';

import Icon from '../ui/Icon';

if (process.env.BROWSER) {
  require('./HostedConversation.scss');
}

export class HostedConversation extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const { onCloseClick, conversation, onClick } = this.props;
    return (
      <div className="HostedConversation" onClick={ onClick }>
        <div className="HostedConversation-header">
          <h3>
            <ConversationName conversation={ conversation } />
          </h3>
          <div className="HostedConversation-toolbar">
            { !conversation.isNew && <ConversationDropdown
              skipItems={ ['toggleRead'] }
              pullRight
              toggle={ <Icon name="cog" size="small" fill /> }
              size="small"
              conversation={ conversation }
            />
          }
            <Icon name="close" size="small" fill onClick={ onCloseClick } />
          </div>
        </div>
        <div className="HostedConversation-conversation">
          <Conversation id={ conversation.id } layout="hosted" />
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
  conversation: denormalize(state.entities.conversations[ownProps.id], state.entities, 'CONVERSATION'),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseClick: () => dispatch(closeConversation({ id: ownProps.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(HostedConversation);
