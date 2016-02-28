import Fluxxor from "fluxxor";

import {
  VIDEOCALL_INIT,
  VIDEOCALL_INIT_SUCCESS,
  VIDEOCALL_INIT_FAILURE,
  VIDEOCALL_INVITE,
  VIDEOCALL_INVITE_SUCCESS,
  VIDEOCALL_INVITE_FAILURE

} from "../video_call/actionTypes";

const initialState = {
  token: null,
  identity: null,

  accessManager: null,
  conversationsClient: null,

  initError: null,
  initializing: false,

  currentConversation: null,
  creatingConversation: null,
  createError: null

};

export const VideoCallStore = Fluxxor.createStore({

  initialize({ token, identity }) {
    this.state = {...initialState};

    if (token) {
      this.state.token = token;
    }
    if (identity) {
      this.state.identity = identity;
    }

    this.bindActions(
      VIDEOCALL_INIT, this.handleInitStart,
      VIDEOCALL_INIT_SUCCESS, this.handleInitSuccess,
      VIDEOCALL_INIT_FAILURE, this.handleInitFailure,
      VIDEOCALL_INVITE, this.handleInviteStart,
      VIDEOCALL_INVITE_SUCCESS, this.handleInviteSuccess,
      VIDEOCALL_INVITE_FAILURE, this.handleInviteFailure,
    );
  },

  getState() {
    return this.state;
  },

  handleInitStart() {
    this.state.initializing = true;
    this.emit("change");
  },

  handleInitSuccess({ token, identity, accessManager, conversationsClient }) {
    this.state.initializing = false;
    this.state.token = token;
    this.state.identity = identity;
    this.state.conversationsClient = conversationsClient;
    this.state.accessManager = accessManager;
    this.emit("change");
  },

  handleInitFailure({ error }) {
    this.state.initializing = false;
    this.state.initError = error;
    this.emit("change");
  },

  handleInviteStart() {
    this.state.creatingConversation = true;
    this.emit("change");
  },

  handleInviteSuccess({ conversation }) {
    this.state.currentConversation = conversation;
    this.state.createError = null;
    this.state.creatingConversation = false;
    this.emit("change");
  },

  handleInviteFailure({ error }) {
    this.state.createError = error;
    this.state.creatingConversation = false;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
