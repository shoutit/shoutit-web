import Pusher from 'pusher-js';
import debug from 'debug';

import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';

import { pusherAppKey } from '../config';
import * as actionTypes from '../actions/actionTypes';

import { Schemas } from '../schemas';
import { addMessage, loadConversation, typingUserNotification, removeTypingUser } from '../actions/chat';

const log = debug('shoutit:pusherMiddleware');
// Pusher.log = log;

const client = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: '/api/pusher/auth'
});

const handleNewMessageNotification = (message, store) => {
  const { chat: { currentConversation }, entities: { conversations } } = store.getState();
  const { conversationId } = message;
  const conversation = conversations[conversationId];
  const payload = normalize(message, Schemas.MESSAGE);

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
        unreadMessagesCount
      }
    };
  }
  payload.result = message.id;
  payload.conversationId = conversationId;
  store.dispatch(addMessage(payload));
};

const typingTimeouts = {};
const handleUserIsTypingNotification = (conversationId, user, store) => {

  log('Dispatching typing user...');

  if (typingTimeouts[conversationId]) {
    clearTimeout(typingTimeouts[conversationId]);
    delete typingTimeouts[conversationId];
    log('Cleared timeout for last notification');
  }

  store.dispatch(typingUserNotification(conversationId, user));
  typingTimeouts[conversationId] = setTimeout(() => {
    log('Removing typing user...');
    store.dispatch(removeTypingUser(conversationId, user.id));
    delete typingTimeouts[conversationId];
  }, 3000);
};

export default store => next => action => { // eslint-disable-line no-unused-vars

  let channelId;

  switch (action.type) {

    case actionTypes.LOGIN_SUCCESS:
      const user = action.payload;
      channelId = `presence-u-${user.id}`;

      log('Subscribing channel %s...', channelId);

      const userChannel = client.subscribe(channelId);
      client.userChannel = userChannel;

      userChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        userChannel.bind('new_message', payload => handleNewMessageNotification(camelizeKeys(payload), store));

      // userChannel.bind("new_listen", payload => store.dispatch(newListen(payload)));
      // userChannel.bind("profile_change", payload => store.dispatch(profileChange(payload)));
      });
      userChannel.bind('pusher:subscription_error', (state) => {
      console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });
      break;

    case actionTypes.LOGOUT:
      if (client.userChannel) {
        log('Unsubscribing channel %s for logout', client.userChannel.name);
        client.unsubscribe(client.userChannel.name);
        client.userChannel = null;
      }
      break;

    case actionTypes.SET_CURRENT_CONVERSATION:
      if (client.chatChannel) {
        log('Unsubscribing channel %s for previous conversation', client.chatChannel.name);
        client.unsubscribe(client.chatChannel.name);
        client.chatChannel = null;
      }
      const conversationId = action.payload;
      channelId = `presence-c-${conversationId}`;

      log('Subscribing channel %s...', channelId);

      const chatChannel = client.subscribe(channelId);
      client.chatChannel = chatChannel;

      chatChannel.bind('pusher:subscription_succeeded', () => {
        log('Channel %s subscribed and listening for events', channelId);

        chatChannel.bind('client-user_is_typing', user =>
        handleUserIsTypingNotification(conversationId, camelizeKeys(user), store)
      );

      // chatChannel.bind("left_chat", payload => store.dispatch(newListen(payload)));
      // chatChannel.bind("joined_chat", payload => store.dispatch(profileChange(payload)));
      });

      chatChannel.bind('pusher:subscription_error', (state) => {
      console.error("Error subscribing to channel %s", channelId, state); // eslint-disable-line
      });

      break;

    case actionTypes.NOTIFY_TYPING_USER:
      if (client.chatChannel) {
        log('Triggering `client-user_is_typing` for channel %s', client.chatChannel.name, action.payload);
        client.chatChannel.trigger('client-user_is_typing', action.payload);
      }
  }

  next(action);
};
