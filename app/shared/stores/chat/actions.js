import {
  LOAD_CONVERSATIONS,
  LOAD_CONVERSATIONS_SUCCESS,
  LOAD_CONVERSATIONS_FAILURE
} from "./actionTypes";

import {
  loadConversations,
  loadPreviousConversations,
  loadNextConversations
} from "./client";

export const actions = {

  loadConversations(done) {
    this.dispatch(LOAD_CONVERSATIONS);
    loadConversations().end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_CONVERSATIONS_FAILURE, { error });
        done && done(error);
        return;
      }
      this.dispatch(LOAD_CONVERSATIONS_SUCCESS, res.body);
      done && done();
    });
  },

  loadPreviousConversations(done) {
    const firstId = this.flux.store("chat").getFirstConversationId();
    const firstConversation = this.flux.store("conversations").get(firstId);
    loadPreviousConversations(firstConversation.created_at).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_CONVERSATIONS_FAILURE, { error });
        return;
      }
      const { results, previous } = res.body;
      this.dispatch(LOAD_CONVERSATIONS_SUCCESS, { results, previous });
      done && done();
    });
  },

  loadNextConversations(done) {
    const lastId = this.flux.store("chat").getLastConversationId();
    const lastConversation = this.flux.store("conversations").get(lastId);
    loadNextConversations(lastConversation.created_at).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_CONVERSATIONS_FAILURE, { error });
        return;
      }
      const { results, next } = res.body;
      this.dispatch(LOAD_CONVERSATIONS_SUCCESS, { results, next });
      done && done();
    });
  }

};
