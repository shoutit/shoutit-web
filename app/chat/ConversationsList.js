import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadChat } from '../actions/chat';
import { denormalize } from '../schemas';

import ConversationItem from './ConversationItem';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

if (process.env.BROWSER) {
  require('./ConversationsList.scss');
}

export class ConversationsList extends Component {

  static propTypes = {
    isFetching: PropTypes.bool,
    conversations: PropTypes.array,
    onConversationClick: PropTypes.func,
    selectedId: PropTypes.string,
    previousUrl: PropTypes.string,
    showConversationDropdown: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(loadChat());
  }

  componentDidUpdate() {
    this.loadMoreIfNeeded();
  }

  loadMoreIfNeeded() {
    const { dispatch, previousUrl, isFetching } = this.props;
    const { scrollable } = this.refs;
    if (!isFetching && previousUrl && !scrollable.canScroll()) {
      dispatch(loadChat(previousUrl));
    }
  }

  render() {
    const { isFetching, conversations, selectedId, onConversationClick, dispatch, previousUrl, showConversationDropdown } = this.props;
    return (
      <Scrollable
        ref="scrollable"
        preventDocumentScroll
        className="ConversationsList"
        onScrollBottom={ previousUrl ? () => dispatch(loadChat(previousUrl)) : null }
        uniqueId={ conversations.length === 0 ? 'empty' : conversations[conversations.length - 1].id }>


          { conversations.length > 0 &&
            <ul className="htmlNoList">
              { conversations
                  .sort((a, b) => b.modifiedAt - a.modifiedAt)
                  .map(conversation =>
                    <li key={ conversation.id } >
                      <ConversationItem
                        showDropdown={ showConversationDropdown }
                        onClick={ onConversationClick ? e => onConversationClick(conversation, e) : null }
                        conversation={ conversation }
                        selected={ conversation.id === selectedId }
                      />
                    </li>
              ) }
            </ul>
          }

          { !isFetching && conversations.length === 0 &&
            <div className="ListOverlay-empty">
              <p>No messages</p>
            </div>
          }
          { (previousUrl || conversations.length === 0) && isFetching &&
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
  const { entities, paginated } = state;
  return {
    isFetching: paginated.chatConversations.isFetching,
    previousUrl: paginated.chatConversations.previousUrl,
    conversations: paginated.chatConversations.ids.map(
      id => denormalize(entities.conversations[id], entities, 'CONVERSATION'))
        .filter(conversation => !conversation.isNew),
  };
};

export default connect(mapStateToProps)(ConversationsList);
