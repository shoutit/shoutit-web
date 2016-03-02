
/* global Twilio */
import {
  TWILIO_INIT,
  TWILIO_INIT_SUCCESS,
  TWILIO_INIT_FAILURE,

  VIDEOCALL_OUTGOING,
  VIDEOCALL_OUTGOING_SUCCESS,
  VIDEOCALL_OUTGOING_FAILURE,

  VIDEOCALL_INCOMING,
  VIDEOCALL_INCOMING_ACCEPTED,
  VIDEOCALL_INCOMING_REJECTED,
  VIDEOCALL_INCOMING_FAILURE

} from "../video_call/actionTypes";

import debug from "debug";
const log = debug("shoutit:videocall");

export const actions = {

  initTwilio() {
    this.dispatch(TWILIO_INIT);

    if (!Twilio) {
      const error = { status: 500, message: "Missing Twilio SDK"};
      console.error("Could not get twilio token", error); // eslint-disable-line no-console
      this.dispatch(TWILIO_INIT_FAILURE, { error });
      return;
    }

    this.flux.service.create("twilioToken").end((error, data) => {

      if (error) {
        console.error("Could not get token", error); // eslint-disable-line no-console
        this.dispatch(TWILIO_INIT_FAILURE, { error });
        return;
      }

      // Create a Twilio client instance

      const accessManager = new Twilio.AccessManager(data.token);
      const conversationsClient = new Twilio.Conversations.Client(accessManager);

      // Start listening to client

      conversationsClient.listen().then(() => {
        this.dispatch(TWILIO_INIT_SUCCESS, {
          token: data.token,
          identity: data.identity,
          conversationsClient,
          accessManager
        });
      }, error => {
        error.status = 500;
        console.error("Could not connect to Twilio", error); // eslint-disable-line no-console
        this.dispatch(TWILIO_INIT_FAILURE, { error });
      });

      // Handle Twilio client events

      conversationsClient.on("invite", incomingInvite =>
        this.dispatch(VIDEOCALL_INCOMING, incomingInvite)
      );

    });

  },

  inviteToVideoCall(user) {
    const { username: identity } = user;
    const client = this.flux.stores["videocall"].getState().conversationsClient;

    const outgoingInvite = client.inviteToConversation(user.username);
    const videoCallId = new Date().getTime();
    this.dispatch(VIDEOCALL_OUTGOING, { user, outgoingInvite, videoCallId });

    outgoingInvite
      .then(conversation => {
        log("Connected to conversation $s with %s", conversation.sid, identity, conversation);
        this.dispatch(VIDEOCALL_OUTGOING_SUCCESS, { user, conversation, videoCallId });
      })
      .catch(error => {
        console.error("Could not create conversation", error); // eslint-disable-line no-console
        error.status = 500;
        this.dispatch(VIDEOCALL_OUTGOING_FAILURE, { user, error, videoCallId } );
      });

  },

  acceptVideoCall(incomingInvite) {
    incomingInvite.accept()
      .then(conversation => {
        this.dispatch(VIDEOCALL_INCOMING_ACCEPTED, { incomingInvite, conversation });
      })
      .catch(error => {
        console.error("Could not join conversation", error); // eslint-disable-line no-console
        error.status = 500;
        this.dispatch(VIDEOCALL_INCOMING_FAILURE, { error, incomingInvite } );
      });
  },

  rejectVideoCall(incomingInvite) {
    incomingInvite.reject();
    this.dispatch(VIDEOCALL_INCOMING_REJECTED, { incomingInvite });
  }
};
