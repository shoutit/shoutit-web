import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Conversation from './Conversation';
import { closeConversation } from '../actions/conversations';
import { getConversation } from '../reducers/entities/conversations';
import ConversationDropdown from '../chat/ConversationDropdown';

import Icon from '../widgets/Icon';

import './ConversationPopup.scss';

export class ConversationPopup extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const { onCloseClick, conversation, onClick } = this.props;
    return (
      <div className="ConversationPopup" onClick={ onClick }>
        <div className="ConversationPopup-header">
          <h3>
            { conversation.display.title || conversation.display.subTitle }
          </h3>
          <div className="ConversationPopup-toolbar">
            { !conversation.isNew &&
              <ConversationDropdown
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
        <div className="ConversationPopup-conversation">
          <Conversation id={ conversation.id } layout="hosted" />
        </div>
      </div>
    );
  }
}

ConversationPopup.propTypes = {
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func.isRequired,
  conversation: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  conversation: getConversation(state, ownProps.id),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseClick: () => dispatch(closeConversation({ id: ownProps.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationPopup);
