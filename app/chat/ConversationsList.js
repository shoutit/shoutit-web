import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { loadChat } from '../actions/chat';

import { getAllConversations, getPaginationState } from '../reducers/paginated/chatConversations';

import ConversationItem from './ConversationItem';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

import './ConversationsList.scss';

export class ConversationsList extends Component {

  static propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.object),
    onConversationClick: PropTypes.func,
    loadData: PropTypes.func,

    selectedId: PropTypes.string,
    showConversationDropdown: PropTypes.bool,

    isFetching: PropTypes.bool,
    previousUrl: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  componentDidMount() {
    this.props.loadData();
  }

  componentDidUpdate() {
    this.loadMoreIfNeeded();
  }

  loadMoreIfNeeded() {
    const { previousUrl, isFetching, loadData } = this.props;
    const { scrollable } = this.refs;
    if (!isFetching && previousUrl && !scrollable.canScroll()) {
      loadData(previousUrl);
    }
  }

  handleScrollBottom() {
    if (this.props.previousUrl) {
      this.props.loadData(this.props.previousUrl);
    }
  }

  render() {
    const { isFetching, conversations, selectedId, onConversationClick, previousUrl, showConversationDropdown } = this.props;
    return (
      <Scrollable
        ref="scrollable"
        preventDocumentScroll
        className="ConversationsList"
        onScrollBottom={ this.handleScrollBottom }
        uniqueId={ conversations.length === 0 ? 'empty' : conversations[conversations.length - 1].id }>

          { conversations.length > 0 &&
            <ul>
              { conversations.map((conversation, i) =>
                <ConversationItem
                  key={ i }
                  showDropdown={ showConversationDropdown }
                  onClick={ onConversationClick ? e => onConversationClick(conversation, e) : null }
                  conversation={ conversation }
                  selected={ conversation.id === selectedId }
                />
              ) }
            </ul>
          }

          { !isFetching && conversations.length === 0 &&
            <div className="ListOverlay-empty">
              <p>
                <FormattedMessage id="chat.conversation.noMessages" defaultMessage="No messages." />
              </p>
            </div>
          }

          { isFetching && (previousUrl || conversations.length === 0) &&
            <Progress size="small" animate={ isFetching } />
          }

      </Scrollable>

    );
  }

}

const mapStateToProps = state => ({
  conversations: getAllConversations(state),
  ...getPaginationState(state),
});

const mapDispatchToProps = dispatch => ({
  loadData: endpoint => dispatch(loadChat(endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsList);
