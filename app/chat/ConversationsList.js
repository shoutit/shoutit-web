import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { loadChat } from '../actions/chat';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getAllConversations, getPaginationState } from '../reducers/paginated/chatConversations';

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

const mapStateToProps = state => ({
  conversations: getAllConversations(state),
  pagination: getPaginationState(state),
});

const mapDispatchToProps = dispatch => ({
  loadConversations: params => dispatch(loadChat(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsList);
