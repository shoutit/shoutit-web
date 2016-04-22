import Pusher from 'pusher-js';
import debug from 'debug';

import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';

import { pusherAppKey } from '../config';
import * as actionTypes from '../actions/actionTypes';

import { MESSAGE } from '../schemas';
import { addMessage, loadConversation, typingClientNotification, removeTypingClient } from '../actions/chat';

const log = debug('shoutit:pusherMiddleware');
// Pusher.log = log;

const client = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: '/api/pusher/auth',
});

const handleNewMessageNotification = (message, store) => {
  const { chat: { currentConversation }, entities: { conversations } } = store.getState();
  const { conversationId } = message;
  const conversation = conversations[conversationId];
  const payload = normalize(message, MESSAGE);

  if (!conversation) {
    store.dispatch(loadConversation(conversationId));
  } else {
    let unreadMessagesCount = conversation.unreadMessagesCount;
    if (currentConversation !== conversationId) {
      unreadMessagesCount += 1;
    }
    // Update existing conversation entity
    payload.entities.conversations = {
      [conversationId]: {
        lastMessage: message.id,
        modifiedAt: message.createdAt,
        messagesCount: conversation.messagesCount + 1,
        unreadMessagesCount,
      },
    };
  }
  payload.result = message.id;
  payload.conversationId = conversationId;
  store.dispatch(addMessage(payload));
};

const handleReadByNotification = (readBy, store) => {
};

const typingTimeouts = {};
const handleClientIsTypingNotification = (conversationId, profile, store) => {
  log('Dispatching typing client...');

  if (typingTimeouts[conversationId]) {
    clearTimeout(typingTimeouts[conversationId]);
    delete typingTimeouts[conversationId];
    log('Cleared timeout for last notification');
  }

  store.dispatch(typingClientNotification(conversationId, profile));
  typingTimeouts[conversationId] = setTimeout(() => {
    log('Removing typing client...');
    store.dispatch(removeTypingClient(conversationId, profile.id));
    delete typingTimeouts[conversationId];
  }, 3000);
};

export default store => next => action => { // eslint-disable-line no-unused-vars
  let channelId;

  switch (action.type) {

    case actionTypes.LOGIN_SUCCESS:
      const profile = action.payload.user;
      channelId = `presence-v3-p-${profile.id}`;

      log('Subscribing channel %s...', channelId);

      const presenceChannel = client.subscribe(channelId);
      client.presenceChannel = presenceChannel;

      presenceChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        presenceChannel.bind('new_message', payload => handleNewMessageNotification(camelizeKeys(payload), store));

      // presenceChannel.bind("new_listen", payload => store.dispatch(newListen(payload)));
      // presenceChannel.bind("profile_change", payload => store.dispatch(profileChange(payload)));
      });
      presenceChannel.bind('pusher:subscription_error', (state) => {
      console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });
      break;

    case actionTypes.LOGOUT:
      if (client.presenceChannel) {
        log('Unsubscribing channel %s for logout', client.presenceChannel.name);
        client.unsubscribe(client.presenceChannel.name);
        client.presenceChannel = null;
      }
      break;

    case actionTypes.SET_CURRENT_CONVERSATION:
      if (client.conversationChannel) {
        log('Unsubscribing channel %s for previous conversation', client.conversationChannel.name);
        client.unsubscribe(client.conversationChannel.name);
        client.conversationChannel = null;
      }
      const conversationId = action.payload;
      if (!conversationId) {
        return;
      }
      channelId = `presence-v3-c-${conversationId}`;

      log('Subscribing channel %s...', channelId);

      const conversationChannel = client.subscribe(channelId);
      client.conversationChannel = conversationChannel;

      conversationChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        conversationChannel.bind('client-is_typing', typingClient =>
          handleClientIsTypingNotification(conversationId, camelizeKeys(typingClient), store)
      );

        conversationChannel.bind('new_read_by', readBy =>
          handleReadByNotification(conversationId, camelizeKeys(readBy), store)
        );
      // conversationChannel.bind("joined_chat", payload => store.dispatch(profileChange(payload)));
      });

      conversationChannel.bind('pusher:subscription_error', (state) => {
      console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });

      break;

    case actionTypes.NOTIFY_CLIENT_IS_TYPING:
      if (client.conversationChannel) {
        log('Triggering `client-is_typing` for channel %s', client.conversationChannel.name, action.payload);
        client.conversationChannel.trigger('client-is_typing', action.payload);
      }
  }

  next(action);
};
