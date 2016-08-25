import * as actionTypes from './actionTypes';

import { CONVERSATIONS } from '../schemas';

export const loadChat = ({ endpoint } = {}) => ({
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
});

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

export const removeTypingClient = (conversationId, userId) => ({
  type: actionTypes.REMOVE_CLIENT_IS_TYPING,
  payload: { conversationId, userId },
});

export const notifyTypingUser = typingUser => {
  const { id, username, name, firstName, lastName } = typingUser;
  return {
    type: actionTypes.NOTIFY_CLIENT_IS_TYPING,
    payload: { id, username, name, firstName, lastName },
  };
};
