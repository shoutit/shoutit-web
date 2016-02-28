
/* global Twilio */
import {
  VIDEOCALL_INIT,
  VIDEOCALL_INIT_SUCCESS,
  VIDEOCALL_INIT_FAILURE,
  VIDEOCALL_INVITE,
  VIDEOCALL_INVITE_SUCCESS,
  VIDEOCALL_INVITE_FAILURE
} from "../video_call/actionTypes";

import debug from "debug";
const log = debug("shoutit:videocall");

export const actions = {

  initVideoCall() {
    this.dispatch(VIDEOCALL_INIT);

    if (!Twilio) {
      const error = { status: 500, message: "Missing Twilio SDK"};
      console.error("Could not get twilio token", error); // eslint-disable-line no-console
      this.dispatch(VIDEOCALL_INIT_FAILURE, { error });
      return;
    }

    this.flux.service
      .create("twilioToken")
      .end((error, data) => {
        if (error) {
          console.error("Could not get token", error); // eslint-disable-line no-console
          this.dispatch(VIDEOCALL_INIT_FAILURE, { error });
          return;
        }
        const accessManager = new Twilio.AccessManager(data.token);
        const conversationsClient = new Twilio.Conversations.Client(accessManager);
        conversationsClient.listen().then(() => {
          log("Connected to Twilio!");
          this.dispatch(VIDEOCALL_INIT_SUCCESS, {
            token: data.token,
            identity: data.identity,
            conversationsClient,
            accessManager
          });
        }, error => {
          error.status = 500;
          this.dispatch(VIDEOCALL_INIT_FAILURE, { error });
          console.error("Could not connect to Twilio", error); // eslint-disable-line no-console
        });
      });

  },

  inviteToVideoCall(user) {
    const { username: identity } = user;
    const client = this.flux.stores["videocall"].getState().conversationsClient;
    this.dispatch(VIDEOCALL_INVITE, { user });
    client.inviteToConversation(user.username)
      .then(conversation => {
        log("Connected to conversation $s with %s", conversation.sid, identity, conversation);
        this.dispatch(VIDEOCALL_INVITE_SUCCESS, { user, conversation });
      }, error => {
        console.error("Could not create conversation", error); // eslint-disable-line no-console
        error.status = 500;
        this.dispatch(VIDEOCALL_INVITE_FAILURE, { error } );
      });
  }

};
