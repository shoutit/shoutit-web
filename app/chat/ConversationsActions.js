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
  RESET_LAST_LOADED_CONVERSATION,
  MARK_AS_READ,
  MARK_AS_READ_FAILURE,
  MARK_AS_READ_SUCCESS
} from "./ConversationsActionTypes";

import * as client from "./ConversationsClient";

export const actions = {

  loadMessages(id, done) {
    this.dispatch(LOAD_MESSAGES, { id });
    client.loadMessages(id).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(LOAD_MESSAGES_FAILURE, { id, error });
        done && done(error);
        return;
      }
      this.dispatch(LOAD_MESSAGES_SUCCESS, {...res.body, id } );
      done && done(null, {...res.body, id });
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

  markConversationAsRead(id, done) {
    this.dispatch(MARK_AS_READ, { id });
    client.markConversationAsRead(id).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(MARK_AS_READ_FAILURE, { id, error });
        done && done(error);
        return;
      }
      this.dispatch(MARK_AS_READ_SUCCESS, { id });
      done && done();
    });
  },

  /**
   * Mark many conversations as read. Returns a promise.
   * @param  {[String]} ids
   * @return {Promise}
   */
  markConversationsAsRead(ids) {
    const promises = [];
    ids.forEach(id => {
      promises.push(

        new Promise((resolve, reject) =>
          actions.markConversationAsRead(id, (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(res);
          }
        ))

      );
    });
    return Promise.all(promises);
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
