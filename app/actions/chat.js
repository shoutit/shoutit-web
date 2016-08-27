import * as actionTypes from './actionTypes';

import { CONVERSATIONS } from '../schemas';

export function loadChat({ endpoint } = {}) {
  return {
    types: [
      actionTypes.CHAT_LOAD_START,
      actionTypes.CHAT_LOAD_SUCCESS,
      actionTypes.CHAT_LOAD_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { endpoint },
      schema: CONVERSATIONS,
    },
  };
}

export function receiveTypingNotification(conversationId, user) {
  const payload = {
    entities: {
      users: {
        [user.id]: user,
      },
    },
    userId: user.id,
    conversationId,
  };
  return {
    type: actionTypes.CHAT_RECEIVE_TYPING_NOTIFICATION,
    payload,
  };
}

export function stopTyping(conversationId, userId) {
  return {
    type: actionTypes.CHAT_STOP_TYPING,
    payload: { conversationId, userId },
  };
}

export function startTyping(user) {
  return {
    type: actionTypes.CHAT_START_TYPING,
    payload: user,
  };
}
