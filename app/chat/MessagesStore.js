import Fluxxor from "fluxxor";

import {
  LOAD_MESSAGES_SUCCESS,
  DELETE_CONVERSATION_SUCCESS
} from "./ConversationsActionTypes";

import {
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  REPLY_SHOUT,
  REPLY_SHOUT_SUCCESS,
  REPLY_SHOUT_FAILURE,
  NEW_PUSHED_MESSAGE
} from "./MessagesActionTypes";

import {
  LOGOUT
} from "../auth/AuthActionTypes";

const initialState = {
  messages: {}
};

export default Fluxxor.createStore({

  initialize({ messages }) {
    this.state = {...initialState};
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
      SEND_MESSAGE_FAILURE, this.handleSendFailure,
      DELETE_CONVERSATION_SUCCESS, this.handleDeleteConversationSuccess,
      NEW_PUSHED_MESSAGE, this.handlePush,
      LOGOUT, this.handleLogout
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
    this.state.messages = {
      ...this.state.messages,
      [message.id]: message
    };
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

  handleDeleteConversationSuccess({ id }) {
    this.waitFor(["conversations"], () => {
      Object.keys(this.state.messages)
        .filter(messageId => this.get(messageId).conversation_id === id)
        .forEach(messageId => delete this.state.messages[messageId]);
      this.emit("change");
    });
  },

  handlePush(message) {
    if (!this.get(message.id)) {
      this.state.messages[message.id] = message;
      this.emit("change");
    }
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
