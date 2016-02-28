import Fluxxor from "fluxxor";

import { TWILIO_TOKEN_SUCCESS, TWILIO_TOKEN_FAILURE } from "../video_call/actionTypes";

const initialState = {
  token: null,
  identity: null,
  tokenError: null
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
      TWILIO_TOKEN_SUCCESS, this.handleReceivedToken,
      TWILIO_TOKEN_FAILURE, this.handleTokenFailure
    );
  },

  getState() {
    return this.state;
  },

  getTwilioToken() {
    return this.state.token;
  },

  handleReceivedToken({ token, identity }) {
    this.state.token = token;
    this.state.identity = identity;
    this.emit("change");
  },

  handleTokenFailure({ error }) {
    this.state.tokenError = error;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
