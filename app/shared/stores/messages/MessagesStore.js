import Fluxxor from "fluxxor";

import {
  LOAD_MESSAGES_SUCCESS
} from "../conversations/actionTypes";

import {
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  REPLY_SHOUT,
  REPLY_SHOUT_SUCCESS,
  REPLY_SHOUT_FAILURE
} from "../messages/actionTypes";

const initialState = {
  messages: {}
};

export const MessagesStore = Fluxxor.createStore({

  initialize({messages}) {
    this.state = initialState;
    if (messages) {
      this.state.messages = messages;
    }

    this.bindActions(
      LOAD_MESSAGES_SUCCESS, this.handleLoadMessagesSuccess,
      REPLY_CONVERSATION, this.handleSendStart,
      REPLY_CONVERSATION_SUCCESS, this.handleSendSuccess,
      REPLY_CONVERSATION_FAILURE, this.handleSendFailure,
      REPLY_SHOUT, this.handleSendStart,
      REPLY_SHOUT_SUCCESS, this.handleSendSuccess,
      REPLY_SHOUT_FAILURE, this.handleSendFailure,
      SEND_MESSAGE, this.handleSendStart,
      SEND_MESSAGE_SUCCESS, this.handleSendSuccess,
      SEND_MESSAGE_FAILURE, this.handleSendFailure
    );

  },

  getState() {
    return this.state;
  },

  getMessages(ids) {
    return ids.map(id => this.state.messages[id]);
  },

  get(id) {
    return this.state.messages[id];
  },

  handleLoadMessagesSuccess({ results: messages }) {
    messages.map(message => {
      this.state.messages[message.id] = {
        ...this.state.messages[message.id],
        ...message
      };
    });
    this.emit("change");
  },

  handleSendStart({ message }) {
    message.sending = true;
    this.state.messages[message.id] = message;
    this.emit("change");
  },

  handleSendSuccess({ tempMessageId, message }) {
    delete this.state.messages[tempMessageId];
    this.state.messages[message.id] = message;
    this.emit("change");
  },

  handleSendFailure({ message, error }) {
    this.state.messages[message.id].sending = false;
    this.state.messages[message.id].sendError = error;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
