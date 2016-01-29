import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  LOAD_PREVIOUS_MESSAGES,
  LOAD_NEXT_MESSAGES,
  CONVERSATION_DRAFT_CHANGE,
  DELETE_CONVERSATION,
  DELETE_CONVERSATION_SUCCESS,
  DELETE_CONVERSATION_FAILURE,
  RESET_LAST_LOADED_CONVERSATION
} from "./actionTypes";

import * as client from "./client";

export const actions = {

  loadMessages(id) {
    this.dispatch(LOAD_MESSAGES, { id });
    client.loadMessages(id).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_MESSAGES_FAILURE, { id, error });
        return;
      }
      this.dispatch(LOAD_MESSAGES_SUCCESS, {...res.body, id } );
    });
  },

  loadPreviousMessages(id, before) {
    this.dispatch(LOAD_PREVIOUS_MESSAGES, { id });
    client.loadPreviousMessages(id, before).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_MESSAGES_FAILURE, { id, error });
        return;
      }
      const { results, previous } = res.body;
      this.dispatch(LOAD_MESSAGES_SUCCESS, { results, previous, id });
    });
  },

  loadNextMessages(id, after) {
    this.dispatch(LOAD_NEXT_MESSAGES, { id });
    client.loadNextMessages(id, after).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_MESSAGES_FAILURE, { id, error });
        return;
      }
      const { results, next } = res.body;
      this.dispatch(LOAD_MESSAGES_SUCCESS, { results, next, id });
    });
  },

  conversationDraftChange(id, draft) {
    this.dispatch(CONVERSATION_DRAFT_CHANGE, { id, draft });
  },

  deleteConversation(id, done) {
    this.dispatch(DELETE_CONVERSATION, { id });
    client.deleteConversation(id).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(DELETE_CONVERSATION_FAILURE, { id, error });
        done && done(error);
        return;
      }
      this.dispatch(DELETE_CONVERSATION_SUCCESS, { id });
      done && done();
    });
  },

  resetLastLoadedConversation() {
    this.dispatch(RESET_LAST_LOADED_CONVERSATION);
  }

};
