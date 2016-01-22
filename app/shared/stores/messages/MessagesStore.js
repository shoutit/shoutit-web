import Fluxxor from "fluxxor";
import {
  LOAD_MESSAGES_SUCCESS,
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE
} from "../conversations/actionTypes";

const initialState = {
  messages: {}
};

export const MessagesStore = Fluxxor.createStore({

  initialize() {
    this.state = initialState;

    this.bindActions(
      LOAD_MESSAGES_SUCCESS, this.handleLoadMessagesSuccess,
      REPLY_CONVERSATION, this.handleReplyStart,
      REPLY_CONVERSATION_SUCCESS, this.handleReplySuccess,
      REPLY_CONVERSATION_FAILURE, this.handleReplyFailure
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

  handleReplyStart({ message }) {
    message.sending = true;
    this.state.messages[message.id] = message;
    this.emit("change");
  },

  handleReplySuccess({ tempMessageId, message }) {
    delete this.state.messages[tempMessageId];
    this.state.messages[message.id] = message;
    this.emit("change");
  },

  handleReplyFailure({ tempMessageId, error }) {
    this.state.messages[tempMessageId].sendError = error;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
