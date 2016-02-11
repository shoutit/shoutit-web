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
  CONVERSATION_DRAFT_CHANGE,
  DELETE_CONVERSATION,
  DELETE_CONVERSATION_SUCCESS,
  DELETE_CONVERSATION_FAILURE,
  RESET_LAST_LOADED_CONVERSATION,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAILURE
} from "../conversations/actionTypes";

import {
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  REPLY_SHOUT_SUCCESS,
  NEW_PUSHED_MESSAGE
} from "../messages/actionTypes";

import {
  LOGOUT
} from "../users/consts";

const initialState = {
  conversations: {},
  lastLoadedId: null
};

export const ConversationsStore = Fluxxor.createStore({

  initialize({ conversations, lastLoadedId }) {
    this.state = {...initialState};
    if (conversations) {
      this.state.conversations = conversations;
    }
    if (lastLoadedId) {
      this.state.lastLoadedId = lastLoadedId;
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
      REPLY_CONVERSATION_FAILURE, this.handleReplyFailure,
      REPLY_SHOUT_SUCCESS, this.handleReplyShoutSuccess,
      NEW_PUSHED_MESSAGE, this.handlePushedMessage,
      MARK_AS_READ_SUCCESS, this.handleMarkAsReadSuccess,
      MARK_AS_READ_FAILURE, this.handleMarkAsReadFailure,
      DELETE_CONVERSATION, this.handleDeleteConversationStart,
      DELETE_CONVERSATION_SUCCESS, this.handleDeleteConversationSuccess,
      DELETE_CONVERSATION_FAILURE, this.handleDeleteConversationFailure,
      RESET_LAST_LOADED_CONVERSATION, this.handleResetLastLoaded,
      LOGOUT, this.handleLogout
    );

  },

  getState() {
    return this.state;
  },

  get(id) {
    return this.state.conversations[id];
  },

  getLastLoadedId() {
    return this.state.lastLoadedId;
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
        if (conversation.messageIds.length === 0) {
          // Loading the default batch of messages
          conversation.previous = previous;
          conversation.next = next;
          conversation.messageIds = messageIds;
          conversation.last_message = results[results.length-1];
        }
        conversation.loading = false;
        conversation.didLoadMessages = true;
      }

      this.state.conversations = {
        ...this.state.conversations,
        [conversation.id]: conversation
      };

      this.state.lastLoadedId = id;

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

  handleReplyShoutSuccess({ conversationId, tempMessageId, message }) {
    const conversation = this.get(conversationId);
    if (conversation) {
      this.handleReplySuccess({ conversationId, tempMessageId, message});
    }
    else {
      this.emit("change");
    }
  },

  handlePushedMessage(message) {
    this.waitFor(["messages"], () => {
      const conversation = this.get(message.conversation_id);
      if (!conversation) {
        return;
      }
      if (!conversation.messageIds) {
        conversation.messageIds = [];
      }
      const index = conversation.messageIds.findIndex(id => id === message.id);
      if (index === -1) {
        conversation.messageIds.push(message.id);
        conversation.last_message = message;
        conversation.messages_count += 1;
        if (message.conversation_id !== this.getLastLoadedId()) {
          conversation.unread_messages_count += 1;
        }
        this.emit("change");
      }
    });
  },

  handleMarkAsReadSuccess({ id }) {
    this.get(id).unread_messages_count = 0;
    this.emit("change");
  },

  handleMarkAsReadFailure({ id, error }) {
    this.emit("change");
  },

  handleDeleteConversationStart({ id }) {
    this.get(id).isDeleting = true;
    delete this.get(id).deletingError;
    this.emit("change");
  },

  handleDeleteConversationSuccess({ id }) {
    this.waitFor(["chat"], () => {
      delete this.state.conversations[id];
      this.emit("change");
    });
  },

  handleDeleteConversationFailure({ id, error }) {
    this.get(id).isDeleting = false;
    this.get(id).deletingError = error;
    this.emit("change");
  },

  handleResetLastLoaded() {
    this.state.lastLoadedId = null;
    this.emit("change");
  },

  handleLogout() {
    this.state = initialState;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
