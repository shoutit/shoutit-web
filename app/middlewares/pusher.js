import Pusher from "pusher-js";
import debug from "debug";

import { normalize } from "normalizr";
import { camelizeKeys } from "humps";

import { pusherAppKey } from "../config";
import * as actionTypes from "../actions/actionTypes";

import { Schemas } from "../schemas";
import { addMessage } from "../actions/chat";

const log = debug("shoutit:pusherMiddleware");
// Pusher.log = log;

const client = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: "/api/pusher/auth"
});

const onNewMessage = (message, store) => {
  const state = store.getState();
  const payload = normalize(message, Schemas.MESSAGE);
  const { conversationId } = message;
  const conversation = state.entities.conversations[conversationId];

  // Update conversation entity
  payload.entities.conversations= {
    [conversationId]: {
      ...conversation,
      lastMessage: message.id,
      modifiedAt: message.createdAt,
      messagesCount: conversation.messagesCount + 1,
      unreadMessagesCount: conversation.messagesCount // TODO:
    }
  };

  const ids = state.messagesByConversation[conversationId] ? state.messagesByConversation[conversationId].ids : [];
  payload.result = [...ids, message.id];
  payload.conversationId = conversationId;
  store.dispatch(addMessage(payload));
};

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

      presenceChannel.bind("new_message", payload => onNewMessage(camelizeKeys(payload), store));

      // presenceChannel.bind("new_listen", payload => store.dispatch(newListen(payload)));
      // presenceChannel.bind("profile_change", payload => store.dispatch(profileChange(payload)));
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

  }
  next(action);
};
