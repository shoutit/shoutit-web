import {
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  REPLY_SHOUT,
  REPLY_SHOUT_SUCCESS,
  REPLY_SHOUT_FAILURE
} from "../messages/actionTypes";

import * as client from "../messages/client";
import { getUnixTime } from "../../../utils/DateUtils";

function createTempMessage(data) {
  const tempMessageId = new Date().getUTCMilliseconds();
  const message = {
    created_at: getUnixTime(),
    id: tempMessageId,
    is_read: false,
    ...data
  };
  return message;
}

export const actions = {

  replyToConversation(conversationId, text) {
    const user = this.flux.store("users").getLoggedUser();

    // Create a temporary message
    const message = createTempMessage({
      conversation_id: conversationId,
      text,
      user
    });

    this.dispatch(REPLY_CONVERSATION, { conversationId, message });
    client.replyToConversation(conversationId, message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(REPLY_CONVERSATION_FAILURE, {
          conversationId,
          message,
          error
        });
        return;
      }
      this.dispatch(REPLY_CONVERSATION_SUCCESS, {
        conversationId,
        tempMessageId: message.tempMessageId,
        message: res.body
      });
    });
  },

  replyToShout(shoutId, text) {
    const user = this.flux.store("users").getLoggedUser();

    const message = createTempMessage({ text,  user});
    this.dispatch(REPLY_SHOUT, { shoutId, message });

    client.replyToShout(shoutId, message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(REPLY_SHOUT_FAILURE, {
          shoutId,
          message,
          error
        });
        return;
      }
      this.dispatch(REPLY_SHOUT_SUCCESS, {
        shoutId,
        tempMessageId: message.tempMessageId,
        message: res.body
      });
    });
  },

  sendMessage(username, text) {
    const message = createTempMessage({ text,  user: { username: username }});
    this.dispatch(SEND_MESSAGE, { username, message });
    client.sendMessage(message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(SEND_MESSAGE_FAILURE, {
          username,
          message,
          error
        });
        return;
      }
      this.dispatch(SEND_MESSAGE_SUCCESS, {
        username,
        tempMessageId: message.tempMessageId,
        message: res.body
      });
    });
  }

};
