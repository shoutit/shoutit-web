import Pusher from 'pusher-js';
import debug from 'debug';
import { camelizeKeys } from 'humps';

import { normalize } from 'normalizr';
import { MESSAGE, CONVERSATION, NOTIFICATION } from '../schemas';

import { pusherAppKey } from '../config';
import * as actionTypes from '../actions/actionTypes';
import { receiveTypingNotification, stopTyping } from '../actions/chat';
import { loadConversation, replaceConversation } from '../actions/conversations';
import { addNewMessage, readMessage, setMessageReadBy } from '../actions/messages';
import { updateProfileStats, replaceProfile } from '../actions/users';
import { addNotification } from '../actions/notifications';

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

  store.dispatch(receiveTypingNotification(conversationId, profile));
  typingTimeouts[conversationId] = setTimeout(() => {
    log('Removing typing client...');
    store.dispatch(stopTyping(conversationId, profile.id));
    delete typingTimeouts[conversationId];
  }, 3000);
};

function getConversationChannelId(conversation) {
  return `presence-v3-c-${conversation.id}`;
}

export default store => next => action => { // eslint-disable-line no-unused-vars
  let channelId;

  function handleNewMessageEvent(payload) {

    const message = camelizeKeys(payload);
    const normalizedPayload = normalize(message, MESSAGE);
    if (message.profile && store.getState().session.user === message.profile.id) {
      // As pusher will always send the profile as "not owner"
      delete normalizedPayload.entities.users;
    }
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

  }

  switch (action.type) {

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      channelId = `presence-v3-p-${action.payload.result}`;
      log('Subscribing channel %s...', channelId);
      const profileChannel = client.subscribe(channelId);
      profileChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        profileChannel.bind('new_message', payload => {
          log('profileChannel received new_message event', payload);
          handleNewMessageEvent(payload);
        });

        profileChannel.bind('stats_update', payload => {
          log('profileChannel received stats_update event', payload);
          store.dispatch(updateProfileStats(store.getState().session.user, camelizeKeys(payload)));
        });

        profileChannel.bind('profile_update', payload => {
          log('profileChannel received profile_update event', payload);
          store.dispatch(replaceProfile(camelizeKeys(payload)));
        });

        profileChannel.bind('conversation_update', conversation => {
          log('profileChannel received conversation_update event', conversation);
          const normalizedPayload = normalize(camelizeKeys(conversation), CONVERSATION);
          store.dispatch(replaceConversation(normalizedPayload));
        });

        profileChannel.bind('new_notification', notification => {
          log('profileChannel received new_notification event', notification);
          const normalizedPayload = normalize(camelizeKeys(notification), NOTIFICATION);
          store.dispatch(addNotification(normalizedPayload));
        });


      });

      profileChannel.bind('pusher:subscription_error', (state) => {
        console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });

      client.profileChannel = profileChannel;
      break;

    case actionTypes.LOGOUT:
      if (client.profileChannel) {
        log('Unsubscribing channel %s for logout', client.profileChannel.name);
        client.unsubscribe(client.profileChannel.name);
        client.profileChannel = null;
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
          log('conversationChannel received client-is_typing event', payload);
          handleClientIsTypingNotification(conversation.id, camelizeKeys(payload), store);
        });

        conversationChannel.bind('new_message', payload => {
          log('conversationChannel received new_message event', payload);
          handleNewMessageEvent(payload);
        });

        conversationChannel.bind('new_read_by', payload => {
          log('conversationChannel received new_read_by event', payload);
          store.dispatch(setMessageReadBy(camelizeKeys(payload)));
        });

        conversationChannel.bind('conversation_update', conversation => {
          log('conversationChannel received conversation_update event', conversation);
          const normalizedPayload = normalize(conversation, CONVERSATION);
          store.dispatch(replaceConversation(camelizeKeys(normalizedPayload)));
        });

      });

      conversationChannel.bind('pusher:subscription_error', state => {
        console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });


      conversationChannel.bind('pusher:member_added', payload => {
        log('Received pusher:member_added event', payload);
                // store.dispatch(setMessageReadBy(camelizeKeys(payload)));
      });

      conversationChannel.bind('pusher:member_removed', payload => {
        log('Received pusher:member_removed event', payload);
                // store.dispatch(setMessageReadBy(camelizeKeys(payload)));
      });

      break;

    case actionTypes.LEAVE_CONVERSATION_SUCCESS:
    case actionTypes.UNSET_ACTIVE_CONVERSATION:
      channelId = getConversationChannelId(action.payload);
      log('Unsubscribing channel %s', channelId);
      client.unsubscribe(channelId);
      break;

    case actionTypes.CHAT_START_TYPING:
      if (client.conversationChannel) {
        log('Triggering `client-is_typing` for channel %s', client.conversationChannel.name, action.payload);
        client.conversationChannel.trigger('client-is_typing', action.payload);
      }
      break;
  }

  next(action);
};
