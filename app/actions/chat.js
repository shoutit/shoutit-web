import * as actionTypes from './actionTypes';

import { CONVERSATIONS } from '../schemas';

export function loadConversations({ endpoint } = {}) {
  return {
    types: [
      actionTypes.CONVERSATIONS_LOAD_START,
      actionTypes.CONVERSATIONS_LOAD_SUCCESS,
      actionTypes.CONVERSATIONS_LOAD_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { endpoint },
      schema: CONVERSATIONS,
    },
  };
}

export function loadPublicChats({ endpoint } = {}) {
  return {
    types: [
      actionTypes.PUBLIC_CHATS_LOAD_START,
      actionTypes.PUBLIC_CHATS_LOAD_SUCCESS,
      actionTypes.PUBLIC_CHATS_LOAD_FAILURE,
    ],
    service: {
      name: 'publicChats',
      params: { endpoint },
      schema: CONVERSATIONS,
    },
  };
}

export function receiveTypingNotification(conversationId, user) {
  const payload = {
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

export function startTyping({ id, name }) {
  return {
    type: actionTypes.CHAT_START_TYPING,
    payload: { id, name },
  };
}
