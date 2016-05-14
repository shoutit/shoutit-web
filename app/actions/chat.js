import * as actionTypes from './actionTypes';

import { CONVERSATIONS } from '../schemas';

export function loadChat(endpoint) {
  return {
    types: [
      actionTypes.LOAD_CHAT_START,
      actionTypes.LOAD_CHAT_SUCCESS,
      actionTypes.LOAD_CHAT_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { endpoint },
      schema: CONVERSATIONS,
    },
  };
}

export function typingClientNotification(conversationId, user) {
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
    type: actionTypes.RECEIVE_CLIENT_IS_TYPING,
    payload,
  };
}

export function removeTypingClient(conversationId, userId) {
  return {
    type: actionTypes.REMOVE_CLIENT_IS_TYPING,
    payload: { conversationId, userId },
  };
}

export function notifyTypingUser(typingUser) {
  const { id, username, name, firstName, lastName } = typingUser;
  const user = { id, username, name, firstName, lastName };
  return {
    type: actionTypes.NOTIFY_CLIENT_IS_TYPING,
    payload: user,
  };
}
