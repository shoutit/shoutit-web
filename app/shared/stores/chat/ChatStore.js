import Fluxxor from "fluxxor";
import {
  LOAD_CONVERSATIONS,
  LOAD_CONVERSATIONS_SUCCESS,
  LOAD_CONVERSATIONS_FAILURE
} from "./actionTypes";

import {
  REPLY_CONVERSATION_SUCCESS
} from "../messages/actionTypes";

import {
  DELETE_CONVERSATION_SUCCESS
} from "../conversations/actionTypes";

import {
  LOGOUT
} from "../../../auth/AuthActionTypes";

const initialState = {
  next: null,
  previous: null,
  loading: false,
  error: null,
  conversationIds: []
};

export const ChatStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      LOAD_CONVERSATIONS, this.handleStart,
      LOAD_CONVERSATIONS_SUCCESS, this.handleSuccess,
      LOAD_CONVERSATIONS_FAILURE, this.handleFailure,
      REPLY_CONVERSATION_SUCCESS, this.handleReplySuccess,
      DELETE_CONVERSATION_SUCCESS, this.handleDeleteSuccess,
      LOGOUT, this.handleLogout
    );

  },

  getState() {
    return this.state;
  },


  getLastConversationId() {
    const { ids } = this.state.conversationsIds;
    return ids[ids.length - 1];
  },

  getFirstConversationId() {
    const { ids } = this.state.conversationsIds;
    return ids[0];
  },

  handleStart() {
    this.state.loading = true;
    this.emit("change");
  },

  handleSuccess({ next, previous, results }) {
    const ids = results.map(({ id }) => id);
    if (typeof next === "undefined") {
      // Loading previous conversations
      this.state.previous = previous;
      this.state.conversationsIds = [
        ...ids,
        ...this.state.conversationIds
      ];
    }
    else if (typeof previous === "undefined") {
      // Loading next conversations
      this.state.next = next;
      this.state.conversationsIds = [
        ...this.state.conversationIds,
        ...ids
      ];
    }
    else {
      // Loading default batch of conversations
      this.state.previous = previous;
      this.state.next = next;
      this.state.conversationIds = ids;
    }
    this.state.error = null;
    this.state.loading = false;
    this.waitFor(["conversations"], () => this.emit("change"));
  },

  handleFailure({ error }) {
    this.state.loading = false;
    this.state.error = error;
    this.emit("change");
  },

  handleReplySuccess({ conversationId }) {
    this.waitFor(["messages"], () => {
      // sort the conversations by putting the replyed one at first
      const index = this.state.conversationIds.indexOf(conversationId);
      this.state.conversationIds.splice(index, 1);
      this.state.conversationIds.splice(0, 0, conversationId);
      this.emit("change");
    });
  },

  handleDeleteSuccess({ id }) {
    const index = this.state.conversationIds.indexOf(id);
    this.state.conversationIds.splice(index, 1);
    this.emit("change");
  },

  handleLogout() {
    this.state = {...initialState};
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
