import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { loadConversations, loadPublicChats } from '../actions/chat';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import {
  getConversations,
  getPaginationState as getConversationsPagination,
} from '../reducers/paginated/conversations';

import {
  getPublicChats,
  getPaginationState as getPublicChatsPagination,
} from '../reducers/paginated/publicChats';

import ConversationItem from './ConversationItem';
import ScrollablePaginated from '../layout/ScrollablePaginated';
import List from '../layout/List';

import './ConversationsList.scss';

export class ConversationsList extends Component {

  static propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.object),
    onConversationClick: PropTypes.func,
    loadConversations: PropTypes.func,

    selectedId: PropTypes.string,
    showConversationDropdown: PropTypes.bool,

    pagination: PropTypes.shape(PaginationPropTypes),
  }

  constructor(props) {
    super(props);
    this.handleConversationClick = this.handleConversationClick.bind(this);
  }

  handleConversationClick(e, conversation) {
    if (!this.props.onConversationClick) {
      return;
    }
    this.props.onConversationClick(conversation, e);
  }

  render() {
    const { pagination, conversations, selectedId, showConversationDropdown } = this.props;
    return (
      <ScrollablePaginated
        className="ConversationsList"
        loadData={ this.props.loadConversations }
        showProgress={ pagination.isFetching }
        uniqueId={ conversations.length === 0 ? 'empty' : conversations[conversations.length - 1].id }
        { ...pagination }
        nextUrl={ pagination.previousUrl }>
        <List>
          { conversations.length > 0 && conversations.map(conversation =>
            <ConversationItem
              key={ conversation.id }
              showDropdown={ showConversationDropdown }
              onClick={ this.handleConversationClick }
              conversation={ conversation }
              selected={ conversation.id === selectedId }
            />
          )}
        </List>

        { !pagination.isFetching && conversations.length === 0 &&
          <div className="ListOverlay-empty">
            <p>
              <FormattedMessage
                id="chat.conversation.noMessages"
                defaultMessage="No messages."
              />
            </p>
          </div>
        }
      </ScrollablePaginated>

    );
  }

}

const mapStateToProps = (state, ownProps) => ({

  conversations: ownProps.chatType === 'public_chats' ?
    getPublicChats(state) :
    getConversations(state),

  pagination: ownProps.chatType === 'public_chats' ?
    getPublicChatsPagination(state) :
    getConversationsPagination(state),

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadConversations: ownProps.chatType === 'public_chats' ?
     params => dispatch(loadPublicChats(params)) :
     params => dispatch(loadConversations(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsList);
