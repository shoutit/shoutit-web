import Pusher from "pusher-js";
import debug from "debug";

import { pusherAppKey } from "../config";
import * as actionTypes from "../actions/actionTypes";
import { newListen, newMessage, profileChange } from "../actions/pusher";

const log = debug("shoutit:pusherMiddleware");

// Pusher.log = log;

const client = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: "/api/pusher/auth"
});

export default store => next => action => { // eslint-disable-line no-unused-vars

  switch (action.type) {

  case actionTypes.LOGIN_SUCCESS:
    const user = action.payload;
    const channelId = `presence-u-${user.id}`;

    log("Subscribing channel %s...", channelId);

    const presenceChannel = client.subscribe(channelId);
    client.presenceChannel = presenceChannel;

    presenceChannel.bind("pusher:subscription_succeeded", () => {
      log("Channel %s subscribed and listening for events", channelId);
      presenceChannel.bind("new_message", payload => store.dispatch(newMessage(payload)));
      presenceChannel.bind("new_listen", payload => store.dispatch(newListen(payload)));
      presenceChannel.bind("profile_change", payload => store.dispatch(profileChange(payload)));
    });
    presenceChannel.bind("pusher:subscription_error", (state) => {
      console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
    });
    break;

  case actionTypes.LOGOUT:
    if (client.presenceChannel) {
      log("Unsubscribing channel %s for logout", client.presenceChannel.name);
      client.unsubscribe(client.presenceChannel.name);
      client.presenceChannel = null;
    }
    break;

  default:
    break;
  }

  next(action);
};
