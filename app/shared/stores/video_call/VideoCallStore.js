import Fluxxor from "fluxxor";

import {
  TWILIO_INIT,
  TWILIO_INIT_SUCCESS,
  TWILIO_INIT_FAILURE,
  VIDEOCALL_OUTGOING,
  VIDEOCALL_OUTGOING_SUCCESS,
  VIDEOCALL_OUTGOING_FAILURE,
  VIDEOCALL_INCOMING,
  VIDEOCALL_INCOMING_ACCEPTED,
  VIDEOCALL_INCOMING_REJECTED
} from "../video_call/actionTypes";

const initialState = {
  token: null,
  identity: null,

  initError: null, // Error when Twilio cannot be initialized
  initializing: false, // True when Twilio is initializing
  initialized: false,

  accessManager: null,
  conversationsClient: null,

  currentConversation: null,

  incomingInvites: [],           // Invites waiting to be accepted or rejected

  outgoingInvites: []
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

      VIDEOCALL_OUTGOING, this.handleOutgoingInvite,
      VIDEOCALL_OUTGOING_SUCCESS, this.handleOutgoingInviteSuccess,
      VIDEOCALL_OUTGOING_FAILURE, this.handleOutgoingInviteFailure,

      VIDEOCALL_INCOMING, this.handleIncomingInvite,
      VIDEOCALL_INCOMING_ACCEPTED, this.handleIncomingInviteAccepted,
      VIDEOCALL_INCOMING_REJECTED, this.handleIncomingInviteRejected

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

  handleOutgoingInvite(outgoingInvite) {
    this.state.outgoingInvites.push(outgoingInvite);
    this.emit("change");
  },

  handleOutgoingInviteSuccess({ outgoingInvite, conversation }) {
    this.state.currentConversation = conversation;
    this.state.outgoingInvites.splice(
      this.state.outgoingInvites.indexOf(outgoingInvite), 1
    );
    this.emit("change");
  },

  handleOutgoingInviteFailure({ outgoingInvite }) {
    this.state.outgoingInvites.splice(
      this.state.outgoingInvites.indexOf(outgoingInvite), 1
    );
    this.emit("change");
  },

  handleIncomingInvite(incomingInvite) {
    this.state.incomingInvites.push(incomingInvite);
    this.emit("change");
  },

  handleIncomingInviteAccepted({ incomingInvite, conversation }) {
    this.state.currentConversation = conversation;
    this.state.incomingInvites.splice(
      this.state.incomingInvites.indexOf(incomingInvite), 1
    );
    this.emit("change");
  },

  handleIncomingInviteRejected(incomingInvite) {
    this.state.incomingInvites.splice(
      this.state.incomingInvites.indexOf(incomingInvite), 1
    );
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
