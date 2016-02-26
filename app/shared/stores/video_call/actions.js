import {
  TWILIO_TOKEN_SUCCESS,
  TWILIO_TOKEN_FAILURE
} from "../video_call/actionTypes";

import { getTwilioToken } from "../video_call/client";

export const actions = {
  getTwilioToken() {
    getTwilioToken().end((error, res) => {

      if (error || !res.ok) {
        error = error ? { status: 500, ...error } : res;
        this.dispatch(TWILIO_TOKEN_FAILURE, { error });
        return;
      }
      this.dispatch(TWILIO_TOKEN_SUCCESS, res.body);
    });

  }
};
