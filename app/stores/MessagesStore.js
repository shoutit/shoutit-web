import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

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
      actions.LOAD_MESSAGES_SUCCESS, this.handleLoadMessagesSuccess,
      actions.REPLY_CONVERSATION, this.handleSendStart,
      actions.REPLY_CONVERSATION_SUCCESS, this.handleSendSuccess,
      actions.REPLY_CONVERSATION_FAILURE, this.handleSendFailure,
      actions.REPLY_SHOUT, this.handleSendStart,
      actions.REPLY_SHOUT_SUCCESS, this.handleSendSuccess,
      actions.REPLY_SHOUT_FAILURE, this.handleSendFailure,
      actions.SEND_MESSAGE, this.handleSendStart,
      actions.SEND_MESSAGE_SUCCESS, this.handleSendSuccess,
      actions.SEND_MESSAGE_FAILURE, this.handleSendFailure,
      actions.DELETE_CONVERSATION_SUCCESS, this.handleDeleteConversationSuccess,
      actions.NEW_PUSHED_MESSAGE, this.handlePush,
      actions.LOGOUT, this.handleLogout
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
