import Pusher from 'pusher-js';
import debug from 'debug';
import { camelizeKeys } from 'humps';

import { normalize } from 'normalizr';
import { MESSAGE } from '../schemas';

import { pusherAppKey } from '../config';
import * as actionTypes from '../actions/actionTypes';
import { typingClientNotification, removeTypingClient } from '../actions/chat';
import { loadConversation } from '../actions/conversations';
import { addNewMessage, readMessage, setMessageReadBy } from '../actions/messages';
import { updateProfileStats } from '../actions/users';

const log = debug('shoutit:middlewares:pusher');
// Pusher.log = log;

const client = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: '/api/pusher/auth',
});

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

function getConversationChannelId(conversation) {
  return `presence-v3-c-${conversation.id}`;
}

export default store => next => action => { // eslint-disable-line no-unused-vars
  let channelId;

  switch (action.type) {

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      channelId = `presence-v3-p-${action.payload.result}`;
      log('Subscribing channel %s...', channelId);
      const presenceChannel = client.subscribe(channelId);
      presenceChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        presenceChannel.bind('new_message', payload => {
          log('Received new_message event', payload);
          const message = camelizeKeys(payload);
          const normalizedPayload = normalize(message, MESSAGE);
          store.dispatch(addNewMessage(normalizedPayload));

          const { conversationId } = message;

          if (!store.getState().entities.conversations[conversationId]) {
            log('Loading conversation since it is not yet loaded...');
            store.dispatch(loadConversation({ id: conversationId }));
          }

          if (store.getState().chat.activeConversations.includes(conversationId)) {
            log('Marking message as read since its conversation is active');
            store.dispatch(readMessage(message));
          }

        });

        presenceChannel.bind('stats_update', payload => {
          log('Received stats_update event', payload);
          store.dispatch(updateProfileStats(store.getState().session.user, camelizeKeys(payload)));
        });

      });

      presenceChannel.bind('pusher:subscription_error', (state) => {
        console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });

      client.presenceChannel = presenceChannel;
      break;

    case actionTypes.LOGOUT:
      if (client.presenceChannel) {
        log('Unsubscribing channel %s for logout', client.presenceChannel.name);
        client.unsubscribe(client.presenceChannel.name);
        client.presenceChannel = null;
      }
      break;

    case actionTypes.SET_ACTIVE_CONVERSATION:
      const conversation = action.payload;
      channelId = getConversationChannelId(conversation);
      log('Subscribing channel %s...', channelId);

      const conversationChannel = client.subscribe(channelId);
      client.conversationChannel = conversationChannel;

      conversationChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);
      //
        conversationChannel.bind('client-is_typing', payload => {
          log('Received client-is_typing event', payload);
          handleClientIsTypingNotification(conversation.id, camelizeKeys(payload), store);
        });

        conversationChannel.bind('new_read_by', payload => {
          log('Received new_read_by event', payload);
          store.dispatch(setMessageReadBy(camelizeKeys(payload)));
        });
      });

      conversationChannel.bind('pusher:subscription_error', state => {
        console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });

      break;

    case actionTypes.LEAVE_CONVERSATION_SUCCESS:
    case actionTypes.UNSET_ACTIVE_CONVERSATION:
      channelId = getConversationChannelId(action.payload);
      log('Unsubscribing channel %s', channelId);
      client.unsubscribe(channelId);
      break;

    case actionTypes.NOTIFY_CLIENT_IS_TYPING:
      if (client.conversationChannel) {
        log('Triggering `client-is_typing` for channel %s', client.conversationChannel.name, action.payload);
        client.conversationChannel.trigger('client-is_typing', action.payload);
      }
      break;
  }

  next(action);
};
