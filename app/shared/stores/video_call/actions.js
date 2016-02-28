import {
  TWILIO_TOKEN_SUCCESS,
  TWILIO_TOKEN_FAILURE
} from "../video_call/actionTypes";

export const actions = {
  getTwilioToken() {

    this.flux.service
      .create("twilioToken")
      .end((error, data) => {
        if (error) {
          this.dispatch(TWILIO_TOKEN_FAILURE, { error });
          return;
        }
        this.dispatch(TWILIO_TOKEN_SUCCESS, data);
      });

  }
};
