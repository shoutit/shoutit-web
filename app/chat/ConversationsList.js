import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadConversations } from '../actions/chat';
import { denormalize } from '../schemas';

import ConversationItem from './ConversationItem';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

if (process.env.BROWSER) {
  require('./ConversationsList.scss');
}

export class ConversationsList extends Component {

  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    isFetching: PropTypes.bool,
    conversations: PropTypes.array,
    onConversationClick: PropTypes.func,
    selectedId: PropTypes.string,
    previousUrl: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(loadConversations());
  }

  render() {
    const { isFetching, conversations, loggedUser, selectedId, onConversationClick, dispatch, previousUrl } = this.props;
    return (
      <Scrollable
        preventDocumentScroll
        className="ConversationsList"
        onScrollBottom={ previousUrl ? () => dispatch(loadConversations(previousUrl)) : null }
        uniqueId={ conversations.length === 0 ? 'empty' : conversations[conversations.length - 1].id }>

          { conversations.length > 0 &&
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
            </ul>
          }

          { !isFetching && conversations.length === 0 &&
            <div className="ListOverlay-empty">
              <p>No messages</p>
            </div>
          }
          { (previousUrl || conversations.length === 0) &&
            <Progress
              size="small"
              animate={ isFetching }
              label={ conversations.length === 0 ? 'Loading messages…' : 'Loading next messages…' }
            />
          }

      </Scrollable>

    );
  }

}

const mapStateToProps = state => {
  const { entities: { conversations, ...entities }, paginated: { chat } } = state;
  const props = {
    loggedUser: state.session.user,
    isFetching: chat.isFetching,
    previousUrl: chat.previousUrl,
    conversations: chat.ids.map(id => denormalize(conversations[id], entities, 'CONVERSATION')).filter(conversation => !conversation.isNew),
  };
  return props;
};

export default connect(mapStateToProps)(ConversationsList);
