import Fluxxor from "fluxxor";

import { TWILIO_TOKEN_SUCCESS, TWILIO_TOKEN_FAILURE } from "../video_call/actionTypes";

const initialState = {
  token: null,
  tokenError: null
};

export const VideoCallStore = Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};

    this.bindActions(
      TWILIO_TOKEN_SUCCESS, this.handleReceivedToken,
      TWILIO_TOKEN_FAILURE, this.handleTokenFailure
    );
  },

  getState() {
    return this.state;
  },

  handleReceivedToken(token) {
    this.state.token = token;
    this.emit("change");
  },

  handleTokenFailure({ error }) {
    this.state.tokenError = error;
    this.emit("change");
  }

});
