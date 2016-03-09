import Fluxxor from "fluxxor";

import * as actionTypes from "./VideoCallsActionTypes";

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

export default Fluxxor.createStore({

  initialize({ token, identity }) {
    this.state = {...initialState};

    if (token) {
      this.state.token = token;
    }
    if (identity) {
      this.state.identity = identity;
    }

    this.bindActions(

      actionTypes.TWILIO_INIT, this.handleInitStart,
      actionTypes.TWILIO_INIT_SUCCESS, this.handleInitSuccess,
      actionTypes.TWILIO_INIT_FAILURE, this.handleInitFailure,

      actionTypes.VIDEOCALL_OUTGOING, this.handleOutgoingInvite,
      actionTypes.VIDEOCALL_OUTGOING_ACCEPTED, this.handleOutgoingInviteSuccess,
      actionTypes.VIDEOCALL_OUTGOING_REJECTED, this.handleOutgoingInviteFailure,
      actionTypes.VIDEOCALL_OUTGOING_CANCELED, this.handleOutgoingInviteFailure,
      actionTypes.VIDEOCALL_OUTGOING_FAILURE, this.handleOutgoingInviteFailure,

      actionTypes.VIDEOCALL_INCOMING, this.handleIncomingInvite,
      actionTypes.VIDEOCALL_INCOMING_ACCEPTED, this.handleIncomingInviteSuccess,
      actionTypes.VIDEOCALL_INCOMING_REJECTED, this.handleIncomingInviteFailure,
      actionTypes.VIDEOCALL_INCOMING_CANCELED, this.handleIncomingInviteFailure,
      actionTypes.VIDEOCALL_INCOMING_FAILURE, this.handleIncomingInviteFailure,

      actionTypes.VIDEOCALL_DISCONNECTED, this.handleConversationDisconnected

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

  handleOutgoingInvite({ outgoingInvite} ) {
    this.state.outgoingInvites.push(outgoingInvite);
    this.emit("change");
  },

  handleOutgoingInviteSuccess({ outgoingInvite, conversation }) {
    this.state.currentConversation = conversation;
    this.state.outgoingInvites.splice(this.state.outgoingInvites.indexOf(outgoingInvite), 1);
    this.emit("change");
  },

  handleOutgoingInviteFailure({ outgoingInvite }) {
    this.state.outgoingInvites.splice(this.state.outgoingInvites.indexOf(outgoingInvite), 1);
    this.emit("change");
  },

  handleIncomingInvite({ incomingInvite }) {
    this.state.incomingInvites.push(incomingInvite);
    this.emit("change");
  },

  handleIncomingInviteSuccess({ incomingInvite, conversation }) {
    this.state.currentConversation = conversation;
    this.state.incomingInvites.splice(
      this.state.incomingInvites.indexOf(incomingInvite), 1
    );
    incomingInvite.removeAllListeners();
    this.emit("change");
  },

  handleIncomingInviteFailure({incomingInvite}) {
    this.state.incomingInvites.splice(
      this.state.incomingInvites.indexOf(incomingInvite), 1
    );
    incomingInvite.removeAllListeners();
    this.emit("change");
  },

  handleConversationDisconnected(conversation) {
    conversation.removeAllListeners();
    this.state.currentConversation = null;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
