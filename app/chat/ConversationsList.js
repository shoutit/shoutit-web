import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadConversations } from '../actions/chat';
import { denormalize } from '../schemas';

import ConversationItem from './ConversationItem';
import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./ConversationsList.scss');
}

export class ConversationsList extends Component {

  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    isFetching: PropTypes.bool,
    conversations: PropTypes.array,
    onConversationClick: PropTypes.func,
  }

  componentDidMount() {
    this.props.dispatch(loadConversations());
  }

  render() {
    const { isFetching, conversations, loggedUser, selectedId, onConversationClick } = this.props;
    return (
      <div className="ConversationsList">
        { isFetching && conversations.length === 0 ?
            <Progress animate /> :

          conversations.length > 0 ?
          <ul className="htmlNoList">
            { conversations
                .sort((a, b) => b.modifiedAt - a.modifiedAt)
                .map(conversation =>
              <li key={ conversation.id } >
                <ConversationItem
                  onClick={ onConversationClick ? e => onConversationClick(conversation, e) : null }
                  conversation={ conversation }
                  loggedUser={ loggedUser }
                  unread = { conversation.unreadMessagesCount > 0 }
                  selected={ conversation.id === selectedId }
                />
              </li>
            )}
          </ul> :

          <div className="ListOverlay-empty">
            <p>No messages</p>
          </div>
        }
      </div>

    );
  }

}

const mapStateToProps = state => {
  const { entities: { conversations, ...entities }, paginated: { chat } } = state;
  const props = {
    loggedUser: state.session.user,
    isFetching: chat.isFetching,
    conversations: chat.ids.map(id => denormalize(conversations[id], entities, 'CONVERSATION')),
  };
  return props;
};

export default connect(mapStateToProps)(ConversationsList);
