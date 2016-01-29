import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";
import { History } from "react-router";

import ConversationTitle from "../chat/ConversationTitle.jsx";
import ConversationDeleteDialog from "../chat/ConversationDeleteDialog.jsx";
import MessagesList from "../chat/MessagesList.jsx";
import MessageReplyForm from "../chat/MessageReplyForm.jsx";
import Progress from "../helper/Progress.jsx";

import { client as pusher} from "../../../client/pusher";

if (process.env.BROWSER) {
  require("styles/components/Conversation.scss");
}

/**
 * Container component to display a conversation.
 */
export default React.createClass({

  displayName: "Conversation",

  mixins: [new FluxMixin(React), new StoreWatchMixin("conversations"), History],

  getInitialState() {
    return {
      showDeleteConversationDialog: false
    };
  },

  componentDidMount() {
    this.loadData();
    pusher.subscribe(`presence-c-${this.props.params.id}`, this.props.loggedUser);
    if (this.list) {
      this.list.scrollTop = this.list.scrollHeight;
      this.setState({
        scrollTop: this.list.scrollHeight,
        scrollHeight: this.list.scrollHeight
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      // Reset scroll state as the conversation change
      this.setState({
        scrollTop: undefined,
        scrollHeight: undefined
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.id !== this.props.params.id) {
      this.loadData();
      pusher.unsubscribe(`presence-c-${prevProps.params.id}`, this.props.loggedUser);
      pusher.subscribe(`presence-c-${this.props.params.id}`, this.props.loggedUser);
    }
    const { messages } = this.state;
    if (prevState.messages.length !== messages.length && this.list) {
      const addedBefore = prevState.messages.length > 0 && messages.length > 0
        && prevState.messages[0].id !== messages[0].id;

      const previousHeight = prevState.scrollHeight;
      const scrollHeight = this.list.scrollHeight;

      let scrollTop;
      if (!previousHeight || !addedBefore) {
        // Scroll to bottom of the list
        scrollTop = scrollHeight;
      }
      else {
        // keep scrollTop the same as before, even if new messages have been added
        scrollTop = scrollHeight - previousHeight + prevState.scrollTop;
      }
      this.list.scrollTop = scrollTop;
      this.setState({ scrollHeight, scrollTop });
    }

  },

  componentWillUnmount() {
    pusher.unsubscribe(`presence-c-${this.props.params.id}`);
  },

  list: null,

  getStateFromFlux() {
    const { id } = this.props.params;
    const conversationsStore = this.getFlux().store("conversations");
    const messagesStore = this.getFlux().store("messages");
    const userStore = this.getFlux().store("users");
    const conversation = conversationsStore.get(id);
    const loggedUser = userStore.getLoggedUser();

    const state = { messages: [], loading: true, loggedUser };

    if (conversation) {
      const { messageIds } = conversation;
      const draft = conversationsStore.getDraft(id);
      const messages = messageIds ? messagesStore.getMessages(messageIds) : [];
      return { ...state, ...conversation, messages, draft };
    }

    return state;
  },

  loadData() {
    const { id } = this.props.params;
    const flux = this.getFlux();
    const conversation = flux.store("conversations").get(id);
    if (conversation && conversation.didLoad && conversation.didLoadMessages) {
      const messages = flux.store("messages").getMessages(conversation.messageIds);
      this.setState({...conversation, messages});
    }
    this.getFlux().actions.loadMessages(id);
  },

  handleListScroll(e) {
    const scrollTop = e.target.scrollTop;
    const { didLoad, previous, loadingPrevious, messages } = this.state;

    const shouldLoadPreviousMessages = scrollTop < 10 && messages.length > 0 &&
      didLoad && previous && !loadingPrevious;

    if (shouldLoadPreviousMessages) {
      const { id } = this.props.params;
      this.getFlux().actions.loadPreviousMessages(
        id,
        messages[0].created_at
      );
    }
    this.setState({ scrollTop });
  },

  render() {

    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, loggedUser, users, about,
      type, error, showDeleteConversationDialog, isDeleting } = this.state;

    const { conversationDraftChange, replyToConversation, deleteConversation }
      = this.getFlux().actions;

    return (
      <div className="Conversation">

      { didLoad &&
        <ConversationTitle
          onDeleteConversationTouchTap={ () => this.setState({showDeleteConversationDialog: true}) }
          onDeleteMessagesTouchTap={ () => {} }
          users={ users }
          about={ about }
          type={ type }
          me={ loggedUser && loggedUser.username }
        />
      }

      { error && !loading &&
        <div className="Conversation-error">
          { error.status && error.status === 404 ? "Page not found" : "Error loading this chat." }
        </div>
      }

      { didLoad && !messages.length > 0 && loading && <Progress centerVertical /> }

      { messages.length > 0 &&
        <div className="Conversation-listContainer"
          ref={ ref => this.list = ref }
          onScroll={ this.handleListScroll }>
          <div className="Conversation-listTopSeparator" />
          <div
            className="Conversation-progress"
            style={ loadingPrevious ? null : { visibility: "hidden" }}>
            <Progress />
          </div>
          <MessagesList messages={ messages } me={ loggedUser && loggedUser.username } />
        </div>
      }

      { messages.length > 0 &&
        <div className="Conversation-replyFormContainer">
          <MessageReplyForm
            autoFocus
            placeholder="Add a reply"
            draft={ draft }
            onTextChange={ text => conversationDraftChange(id, text) }
            onSubmit={ () => replyToConversation(loggedUser, id, draft) }
          />
        </div>
      }

      <ConversationDeleteDialog
        open={ showDeleteConversationDialog }
        onCancel={ () => this.setState({showDeleteConversationDialog: false}) }
        onConfirm={() => deleteConversation(id, () => this.history.pushState(null, "/chat") )}
        isDeleting={ isDeleting }
      />

      </div>
    );
  }

});
