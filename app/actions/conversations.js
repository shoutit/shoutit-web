import uuid from 'uuid';

import { getUnixTime } from '../utils/DateUtils';
import * as actionTypes from './actionTypes';
import { CONVERSATION, MESSAGE } from '../schemas';

export const loadConversation = conversation => ({
  types: [
    actionTypes.LOAD_CONVERSATION_START,
    actionTypes.LOAD_CONVERSATION_SUCCESS,
    actionTypes.LOAD_CONVERSATION_FAILURE,
  ],
  service: {
    name: 'conversations',
    params: { id: conversation.id },
    schema: CONVERSATION,
  },
});

export const setActiveConversation = conversation => ({
  type: actionTypes.SET_ACTIVE_CONVERSATION,
  payload: conversation,
});

export const unsetActiveConversation = conversation => ({
  type: actionTypes.UNSET_ACTIVE_CONVERSATION,
  payload: conversation,
});

export const replyToConversation = (conversation, sender, message) => {
  message = {
    ...message,
    profile: sender.id,
    id: `temp-${uuid.v1()}`,
    createdAt: getUnixTime(),
  };
  return {
    types: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE,
    ],
    payload: { conversation, message },
    service: {
      name: 'conversationReply',
      method: 'create',
      params: { id: conversation.id },
      body: message,
      schema: MESSAGE,
    },
  };
};

export const openConversation = conversation => ({
  type: actionTypes.OPEN_CONVERSATION,
  payload: { conversation },
});

export const closeConversation = conversation => ({
  type: actionTypes.CLOSE_CONVERSATION,
  payload: { id: conversation.id },
});

export function startConversation(loggedUser, user) {
  const conversation = {
    id: `new-conversation-with-${user.id}`,
    isNew: true,
    type: 'chat',
    profiles: [
      loggedUser.id,
      user.id,
    ],
  };
  return {
    type: actionTypes.START_CONVERSATION,
    payload: { conversation },
  };
}

export const leave = conversation => ({
  types: [
    actionTypes.LEAVE_CONVERSATION_START,
    actionTypes.LEAVE_CONVERSATION_SUCCESS,
    actionTypes.LEAVE_CONVERSATION_FAILURE,
  ],
  payload: conversation,
  service: {
    name: 'conversations',
    method: 'delete',
    params: { id: conversation.id },
  },
});

export const read = conversation => ({
  types: [
    actionTypes.READ_CONVERSATION_START,
    actionTypes.READ_CONVERSATION_SUCCESS,
    actionTypes.READ_CONVERSATION_FAILURE,
  ],
  payload: { conversation },
  service: {
    name: 'conversationRead',
    method: 'create',
    params: { id: conversation.id },
  },
});

export function unread(conversation) {
  return {
    types: [
      actionTypes.UNREAD_CONVERSATION_START,
      actionTypes.UNREAD_CONVERSATION_SUCCESS,
      actionTypes.UNREAD_CONVERSATION_FAILURE,
    ],
    payload: { conversation },
    service: {
      name: 'conversationRead',
      method: 'delete',
      params: { id: conversation.id },
    },
  };
}
