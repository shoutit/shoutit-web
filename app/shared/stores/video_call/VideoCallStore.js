import Fluxxor from "fluxxor";

import {
  TWILIO_INIT,
  TWILIO_INIT_SUCCESS,
  TWILIO_INIT_FAILURE,
  VIDEOCALL_INVITE,
  VIDEOCALL_INVITE_SUCCESS,
  VIDEOCALL_INVITE_FAILURE,
  VIDEOCALL_INVITE_RECEIVED,
  VIDEOCALL_INVITE_ACCEPTED,
  VIDEOCALL_INVITE_REJECTED
} from "../video_call/actionTypes";

const initialState = {
  token: null,
  identity: null,

  initError: null, // Error when Twilio cannot be initialized
  initializing: false, // True when Twilio is initializing
  initialized: false,

  accessManager: null,
  conversationsClient: null,

  creatingConversation: false,
  createError: null,

  currentConversation: null,

  invites: [] // Invites waiting to be accepted or rejected

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
      TWILIO_INIT, this.handleInitStart,
      TWILIO_INIT_SUCCESS, this.handleInitSuccess,
      TWILIO_INIT_FAILURE, this.handleInitFailure,
      VIDEOCALL_INVITE, this.handleInviteStart,
      VIDEOCALL_INVITE_SUCCESS, this.handleInviteSuccess,
      VIDEOCALL_INVITE_FAILURE, this.handleInviteFailure,
      VIDEOCALL_INVITE_RECEIVED, this.handleInviteReceived,
      VIDEOCALL_INVITE_ACCEPTED, this.handleInviteAccepted,
      VIDEOCALL_INVITE_REJECTED, this.handleInviteRejected
    );
  },

  getState() {
    return this.state;
  },

  handleInitStart() {
    this.state.initializing = true;
    this.state.initialized = false;
    this.emit("change");
  },

  handleInitSuccess({ token, identity, accessManager, conversationsClient }) {
    this.state.initializing = false;
    this.state.token = token;
    this.state.identity = identity;
    this.state.conversationsClient = conversationsClient;
    this.state.accessManager = accessManager;
    this.state.initialized = true;
    this.emit("change");
  },

  handleInitFailure({ error }) {
    this.state.initializing = false;
    this.state.initError = error;
    this.state.initialized = false;
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

  handleInviteReceived(invite) {
    this.state.invites.push(invite);
    this.emit("change");
  },

  handleInviteAccepted({ invite, conversation }) {
    this.state.currentConversation = conversation;
    this.state.invites.splice(this.state.invites.indexOf(invite), 1);
    this.emit("change");
  },

  handleInviteRejected(invite) {
    this.state.invites.splice(this.state.invites.indexOf(invite), 1);
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
