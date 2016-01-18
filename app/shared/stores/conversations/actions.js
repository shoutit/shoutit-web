import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  LOAD_PREVIOUS_MESSAGES,
  LOAD_NEXT_MESSAGES,
  CONVERSATION_DRAFT_CHANGE,
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_FAILURE,
  REPLY_CONVERSATION_SUCCESS
} from "./actionTypes";

import { loadMessages, loadPreviousMessages, loadNextMessages, replyToConversation } from "./client";
import { getUnixTime } from "../../../utils/DateUtils";

export const actions = {

  loadMessages(id, done) {
    this.dispatch(LOAD_MESSAGES, { id });
    loadMessages(id).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { ...error, status: 500 } : res;
        this.dispatch(LOAD_MESSAGES_FAILURE, { id, error });
        return;
      }
      this.dispatch(LOAD_MESSAGES_SUCCESS, {...res.body, id } );
      done && done();
    });
  },

  loadPreviousMessages(id, done) {
    const firstMessageId = this.flux.store("conversations").getFirstMessageId(id);
    const firstMessage = this.flux.store("messages").get(firstMessageId);
    this.dispatch(LOAD_PREVIOUS_MESSAGES, { id });
    loadPreviousMessages(id, firstMessage.created_at).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { ...error, status: 500 } : res;
        this.dispatch(LOAD_MESSAGES_SUCCESS, { id, error });
        return;
      }
      const { results, previous } = res.body;
      this.dispatch(LOAD_MESSAGES_SUCCESS, { results, previous, id });
      done && done();
    });
  },

  loadNextMessages(id, done) {
    const lastMessageId = this.flux.store("conversations").getLastMessageId(id);
    const lastMessage = this.flux.store("messages").get(lastMessageId);
    this.dispatch(LOAD_PREVIOUS_MESSAGES, { id });
    this.dispatch(LOAD_NEXT_MESSAGES, { id });
    loadNextMessages(id, lastMessage.created_at).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { ...error, status: 500 } : res;
        this.dispatch(LOAD_MESSAGES_SUCCESS, { id, error });
        return;
      }
      const { results, next } = res.body;
      this.dispatch(LOAD_MESSAGES_SUCCESS, { results, next, id });
      done && done();
    });
  },

  replyToConversation(id, text) {
    const user = this.flux.store("users").getLoggedUser();
    const tempMessageId = new Date().getUTCMilliseconds();
    // Create a temporary message
    const message = {
      conversation_id: id,
      created_at: getUnixTime(),
      id: tempMessageId,
      is_read: false,
      text,
      user
    };
    this.dispatch(REPLY_CONVERSATION, { id, message });
    replyToConversation(id, message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { ...error, status: 500 } : res;
        this.dispatch(REPLY_CONVERSATION_FAILURE, { id, tempMessageId, message, error });
        return;
      }
      this.dispatch(REPLY_CONVERSATION_SUCCESS, { id, tempMessageId, message: res.body });
    });
  },

  conversationDraftChange(id, draft) {
    this.dispatch(CONVERSATION_DRAFT_CHANGE, { id, draft });
  }

};
