import Fluxxor from "fluxxor";

import {
  LOAD_CONVERSATIONS_SUCCESS
} from "../chat/actionTypes";

import {
  LOAD_MESSAGES,
  LOAD_NEXT_MESSAGES,
  LOAD_PREVIOUS_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  CONVERSATION_DRAFT_CHANGE
} from "../conversations/actionTypes";

import {
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE
} from "../messages/actionTypes";

const initialState = {
  conversations: {}
};

export const ConversationsStore = Fluxxor.createStore({


  initialize({ conversations }) {
    this.state = initialState;
    if (conversations) {
      this.state.conversations = conversations;
    }

    this.bindActions(
      LOAD_CONVERSATIONS_SUCCESS, this.handleLoadConversations,
      LOAD_MESSAGES, this.handleStart,
      LOAD_NEXT_MESSAGES, this.handleLoadNextStart,
      LOAD_PREVIOUS_MESSAGES, this.handleLoadPreviousStart,
      LOAD_MESSAGES_SUCCESS, this.handleLoadMessagesSuccess,
      LOAD_MESSAGES_FAILURE, this.handleLoadMessagesFailure,
      CONVERSATION_DRAFT_CHANGE, this.handleDraftChange,
      REPLY_CONVERSATION, this.handleReplyStart,
      REPLY_CONVERSATION_SUCCESS, this.handleReplySuccess,
      REPLY_CONVERSATION_FAILURE, this.handleReplyFailure
    );

  },

  getState() {
    return this.state;
  },

  get(id) {
    return this.state.conversations[id];
  },

  getConversations(ids=[]) {
    return ids.map(id => this.state.conversations[id]);
  },

  getDraft(id) {
    return this.state.conversations[id].draft;
  },

  getPreviousUrl(id) {
    return this.state.conversations[id].previous;
  },

  handleLoadConversations({ results: conversations }) {
    conversations.map((conversation) => {
      this.state.conversations[conversation.id] = {
        ...this.state.conversations[conversation.id],
        didLoad: true,
        ...conversation
      };
    });
    this.emit("change");
  },

  handleStart({ id }) {
    this.state.conversations[id] = {
      ...this.state.conversations[id],
      loading: true
    };
    this.emit("change");
  },

  handleLoadPreviousStart({ id }) {
    this.state.conversations[id] = {
      ...this.state.conversations[id],
      loadingPrevious: true
    };
    this.emit("change");
  },

  handleLoadNextStart({ id }) {
    this.state.conversations[id] = {
      ...this.state.conversations[id],
      loadingNext: true
    };
    this.emit("change");
  },

  handleLoadMessagesSuccess({ next, previous, results, id }) {
    this.waitFor(["messages"], () => {
      const messageIds = results.map(message => message.id);
      const conversation = this.get(id);

      if (!conversation.messageIds) {
        conversation.messageIds = [];
      }

      conversation.error = null;
      conversation.loading = false;
      conversation.unread_messages_count = 0;

      if (typeof next === "undefined") {
        // Loading previous messages
        conversation.previous = previous;
        conversation.loadingPrevious = false;
        conversation.messageIds = [
          ...messageIds,
          ...conversation.messageIds
        ];
      }
      else if (typeof previous === "undefined") {
        // Loading next messages
        conversation.next = next;
        conversation.loadingNext = false;
        conversation.messageIds = [
          ...conversation.messageIds,
          ...messageIds
        ];
      }
      else {

        // Loading the default batch of messages
        conversation.previous = previous;
        conversation.next = next;
        conversation.messageIds = messageIds;
        conversation.loading = false;
        conversation.didLoadMessages = true;
        conversation.last_message = results[results.length-1];
      }

      this.state.conversations[id] = conversation;
      this.emit("change");
    });
  },

  handleLoadMessagesFailure({ error, id }) {
    this.state.conversations[id].loading = false;
    this.state.conversations[id].loadingPrevious = false;
    this.state.conversations[id].loadingNext = false;
    this.state.conversations[id].error = error;
    this.emit("change");
  },

  handleDraftChange({ id, draft }) {
    this.state.conversations[id].draft = draft;
    this.emit("change");
  },

  handleReplyStart({ conversationId: id, message }) {
    this.state.conversations[id].draft = null;
    this.waitFor(["messages"], () => {
      this.state.conversations[id].messageIds.push(message.id);
      this.state.conversations[id].modified_at = message.created_at;
      this.state.conversations[id].messages_count += 1;
      this.emit("change");
    });
  },

  handleReplySuccess({ conversationId: id, tempMessageId, message }) {
    this.waitFor(["messages"], () => {
      const index = this.state.conversations[id].messageIds.indexOf(tempMessageId);
      this.state.conversations[id].messageIds.splice(index, 1);
      this.state.conversations[id].messageIds.push(message.id);
      this.state.conversations[id].last_message = message;
      this.emit("change");
    });
  },

  handleReplyFailure() {
    this.waitFor(["messages"], () => this.emit("change"));
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
