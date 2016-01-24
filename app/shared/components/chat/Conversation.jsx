import React from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import ConversationTitle from "../chat/ConversationTitle.jsx";
import MessagesList from "../chat/MessagesList.jsx";
import MessageReplyForm from "../chat/MessageReplyForm.jsx";
import Progress from "../helper/Progress.jsx";

if (process.env.BROWSER) {
  require("styles/components/Conversation.scss");
}

/**
 * Container component to display a conversation.
 */
export default React.createClass({

  displayName: "Conversation",

  mixins: [new FluxMixin(React), new StoreWatchMixin("conversations")],

  componentDidMount() {
    this.loadData();
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

  list: null,

  getStateFromFlux() {
    const { id } = this.props.params;
    const conversationsStore = this.getFlux().store("conversations");
    const messagesStore = this.getFlux().store("messages");
    const userStore = this.getFlux().store("users");

    const conversation = conversationsStore.get(id);
    const { username: me } = userStore.getLoggedUser();
    const state = {
      messages: [],
      loading: true,
      me
    };
    if (conversation && conversation.didLoad) {
      const { messageIds } = conversation;
      const draft = conversationsStore.getDraft(id);
      const messages = messageIds ? messagesStore.getMessages(messageIds) : [];
      return {
        ...state,
        ...conversation,
        messages,
        draft
      };
    }
    return state;
  },

  loadData() {
    const { id } = this.props.params;
    const flux = this.getFlux();
    const conversation = flux.store("conversations").get(id);
    if (conversation && conversation.didLoad && conversation.didLoadMessages) {
      // Do not request data again if already loaded
      const messages = flux.store("messages").getMessages(conversation.messageIds);
      this.setState({...conversation, messages});
      return;
    }
    this.getFlux().actions.loadMessages(id);
  },

  handleListScroll(e) {
    const scrollTop = e.target.scrollTop;
    const { didLoad, previous, loadingPrevious, messages } = this.state;

    const shouldLoadPreviousMessages = scrollTop < 10 && messages.length > 0 &&
      didLoad && previous && !loadingPrevious;

    if (shouldLoadPreviousMessages) {
      this.getFlux().actions.loadPreviousMessages(this.props.params.id);
    }

    this.setState({ scrollTop });

  },

  render() {

    const { id } = this.props.params;
    const { messages, draft, didLoad, loading, loadingPrevious, me, users, about,
      type } = this.state;

    const { conversationDraftChange, replyToConversation }
      = this.getFlux().actions;

    const hasMessages = messages.length > 0 ;

    return (
      <div className="Conversation">

        { didLoad &&
          <ConversationTitle users={ users } about={ about } type={ type } me={ me } /> }

        { didLoad && !hasMessages && loading && <Progress centerVertical /> }

        { hasMessages &&
          <div className="Conversation-listContainer"
            ref={ ref => this.list = ref }
            onScroll={ this.handleListScroll }>

            <div className="Conversation-listTopSeparator" />

            <div className="Conversation-progress"
              style={ loadingPrevious ? null : { visibility: "hidden" }}>
              <Progress />
            </div>

            <MessagesList messages={ messages } me={ me } />

          </div>
        }

        { hasMessages &&
          <div className="Conversation-replyFormContainer">
            <MessageReplyForm
              autoFocus
              placeholder="Add a reply"
              draft={ draft }
              onTextChange={ text => conversationDraftChange(id, text) }
              onSubmit={ () => replyToConversation(id, draft) }
            />
          </div>
        }
      </div>
    );
  }

});
