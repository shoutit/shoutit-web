
/* global Twilio */
import * as actionTypes from "../videoCalls/actionTypes";

function subscribeConversationEvents(conversation, self) {
  conversation.on("disconnected", () => {
    self.dispatch(actionTypes.VIDEOCALL_DISCONNECTED, conversation);
  });
  conversation.on("participantDisconnected", () => {
    self.dispatch(actionTypes.VIDEOCALL_PARTICIPANT_DISCONNECTED, conversation);
  });
}

export const actions = {

  initTwilio() {
    this.dispatch(actionTypes.TWILIO_INIT);
    const { service } = this.flux;

    if (!Twilio) {
      const error = { status: 500, message: "Missing Twilio SDK"};
      console.error("Could not get twilio token", error); // eslint-disable-line no-console
      this.dispatch(actionTypes.TWILIO_INIT_FAILURE, { error });
      return;
    }

    service.create("twilioToken").end((error, data) => {

      if (error) {
        console.error("Could not get token", error); // eslint-disable-line no-console
        this.dispatch(actionTypes.TWILIO_INIT_FAILURE, { error });
        return;
      }

      // Create a Twilio client instance

      const accessManager = new Twilio.AccessManager(data.token);
      const conversationsClient = new Twilio.Conversations.Client(accessManager);

      // Start listening to client

      conversationsClient.listen().then(() => {
        this.dispatch(actionTypes.TWILIO_INIT_SUCCESS, {
          token: data.token,
          identity: data.identity,
          conversationsClient,
          accessManager
        });
      }, error => {
        error.status = 500;
        console.error("Could not connect to Twilio", error); // eslint-disable-line no-console
        this.dispatch(actionTypes.TWILIO_INIT_FAILURE, { error });
      });

      // Handle Twilio client events

      conversationsClient.on("invite", incomingInvite => {

        service.read("profile")
          .params({ username: incomingInvite.from})
          .end((err, user) => {
            const payload = { incomingInvite, user };

            this.dispatch(actionTypes.VIDEOCALL_INCOMING, payload);

            incomingInvite.on("rejected", error =>
              this.dispatch(actionTypes.VIDEOCALL_INCOMING_REJECTED, { ...payload, error })
            );
            incomingInvite.on("failed", error =>
              this.dispatch(actionTypes.VIDEOCALL_INCOMING_FAILURE, { ...payload, error })
            );
            incomingInvite.on("canceled", error =>
              this.dispatch(actionTypes.VIDEOCALL_INCOMING_CANCELED, { ...payload, error })
            );

          });



      });

    });

  },

  previewVideoCall(user) {
    this.dispatch(actionTypes.VIDEOCALL_PREVIEW, { user });
  },

  acceptVideoCall(incomingInvite) {
    incomingInvite.accept()
      .then(conversation => {
        subscribeConversationEvents(conversation, this);
        this.dispatch(actionTypes.VIDEOCALL_INCOMING_ACCEPTED, { incomingInvite, conversation });
      });
  },

  inviteToVideoCall(user) {
    const client = this.flux.stores["videocall"].getState().conversationsClient;
    const outgoingInvite = client.inviteToConversation(user.username);
    const videoCallId = new Date().getTime();
    this.dispatch(actionTypes.VIDEOCALL_OUTGOING, { user, outgoingInvite, videoCallId });

    outgoingInvite
      .then(conversation => {
        subscribeConversationEvents(conversation, this);
        this.dispatch(actionTypes.VIDEOCALL_OUTGOING_ACCEPTED, { user, conversation, videoCallId });
      })
      .catch(error => {
        let actionType;
        switch (outgoingInvite.status) {
        case "canceled":
          actionType = actionTypes.VIDEOCALL_OUTGOING_CANCELED;
          break;
        case "rejected":
          actionType = actionTypes.VIDEOCALL_OUTGOING_REJECTED;
          break;
        default:
          actionType = actionTypes.VIDEOCALL_OUTGOING_FAILURE;
        }
        console.error("Could not create conversation", error); // eslint-disable-line no-console
        this.dispatch(actionType, { user, outgoingInvite, error, videoCallId });
      });

  }

};
