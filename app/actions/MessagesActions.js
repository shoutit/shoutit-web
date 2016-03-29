import {
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  REPLY_SHOUT,
  REPLY_SHOUT_SUCCESS,
  REPLY_SHOUT_FAILURE,
  NEW_PUSHED_MESSAGE
} from './actionTypes';

import * as client from './MessagesClient';
import { getUnixTime } from '../utils/DateUtils';

function createTempMessage(data) {
  const tempMessageId = new Date().getUTCMilliseconds();
  const message = {
    created_at: getUnixTime(),
    id: tempMessageId,
    ...data,
  };
  return message;
}

export default {

  replyToConversation(user, conversationId, text, attachments) {
    const message = createTempMessage({
      conversation_id: conversationId,
      text,
      user,
      attachments,
    });
    this.dispatch(REPLY_CONVERSATION, { conversationId, message });
    client.replyToConversation(conversationId, message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(REPLY_CONVERSATION_FAILURE, {
          conversationId,
          message,
          error,
        });
        return;
      }
      this.dispatch(REPLY_CONVERSATION_SUCCESS, {
        conversationId,
        tempMessageId: message.id,
        message: res.body,
      });
    });

    return message;
  },

  newPushedMessage(message) {
    this.dispatch(NEW_PUSHED_MESSAGE, message);
  },

  /**
   * Reply to a shout.
   * @param  {Object}   loggedUser The logged user (that is sending the message)
   * @param  {String}   shoutId
   * @param  {String}   text    The content of the message
   * @param  {Function} [done]  Optional. A callback function (err, sentMessage)
   * @return {Object}   The temporary message that is going to be sent.
   */
  replyToShout(loggedUser, shoutId, text, done) {
    const message = createTempMessage({ text, user: loggedUser });
    this.dispatch(REPLY_SHOUT, { shoutId, message });
    client.replyToShout(shoutId, message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(REPLY_SHOUT_FAILURE, {
          shoutId,
          message,
          error,
        });
        done && done(error);
        return;
      }
      this.flux.actions.loadMessages(res.body.conversation_id, () => {
        this.flux.actions.loadConversations(() => {

          this.dispatch(REPLY_SHOUT_SUCCESS, {
            shoutId,
            tempMessageId: message.id,
            message: res.body,
          });
          done && done(null, res.body);
        });
      });
    });
    return message;
  },

  /**
   * Send a message to a user.
   * @param  {Object}   loggedUser The logged user (that is sending the message)
   * @param  {String}   to      The username of the recipeint
   * @param  {String}   text    The content of the message
   * @param  {Function} [done]  Optional. A callback function (err, sentMessage)
   * @return {Object}   The temporary message that is going to be sent.
   */
  sendMessage(loggedUser, to, text, done) {
    const message = createTempMessage({ text, user: loggedUser });
    this.dispatch(SEND_MESSAGE, { to, message });
    client.sendMessage(message).end((error, res) => {
      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(SEND_MESSAGE_FAILURE, {
          to,
          message,
          error,
        });
        done && done(error);
        return;
      }
      this.dispatch(SEND_MESSAGE_SUCCESS, {
        to,
        tempMessageId: message.id,
        message: res.body,
      });
      done && done(error, res.body);
    });
    return message;
  },

};
