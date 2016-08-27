import uuid from 'uuid';
import { now } from 'unix-timestamp';

import * as actionTypes from './actionTypes';
import { CONVERSATION, MESSAGE } from '../schemas';

export function loadConversation(conversation) {
  return {
    types: [
      actionTypes.CONVERSATION_LOAD_START,
      actionTypes.CONVERSATION_LOAD_SUCCESS,
      actionTypes.CONVERSATION_LOAD_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { id: conversation.id },
      schema: CONVERSATION,
    },
  };
}

export function setActiveConversation(conversation) {
  return {
    type: actionTypes.CONVERSATION_SET_ACTIVE,
    payload: conversation,
  };
}

export function unsetActiveConversation(conversation) {
  return {
    type: actionTypes.CONVERSATION_UNSET_ACTIVE,
    payload: conversation,
  };
}

export function replyToConversation(conversation, sender, message) {
  const tempMessage = {
    ...message,
    profile: sender.id,
    id: `temp-${uuid.v1()}`,
    createdAt: now(),
  };
  return {
    types: [
      actionTypes.CONVERSATION_REPLY_START,
      actionTypes.CONVERSATION_REPLY_SUCCESS,
      actionTypes.CONVERSATION_REPLY_FAILURE,
    ],
    payload: {
      conversation,
      message: tempMessage,
    },
    service: {
      name: 'conversationReply',
      method: 'create',
      params: { id: conversation.id },
      body: tempMessage,
      schema: MESSAGE,
    },
  };
}

export function openConversation(conversation) {
  return {
    type: actionTypes.CONVERSATION_OPEN,
    payload: { conversation },
  };
}

export function closeConversation(conversation) {
  return {
    type: actionTypes.CONVERSATION_CLOSE,
    payload: { id: conversation.id },
  };
}

export function beginConversation(sender, recipient) {
  const conversation = {
    id: `new-conversation-with-${recipient.id}`,
    isNew: true,
    type: 'chat',
    display: {
      title: recipient.name,
    },
    profiles: [
      sender.id,
      recipient.id,
    ],
  };
  return {
    type: actionTypes.CONVERSATION_BEGIN,
    payload: { conversation },
  };
}

export function leaveConversation(conversation) {
  return {
    types: [
      actionTypes.CONVERSATION_LEAVE_START,
      actionTypes.CONVERSATION_LEAVE_SUCCESS,
      actionTypes.CONVERSATION_LEAVE_FAILURE,
    ],
    payload: conversation,
    service: {
      name: 'conversations',
      method: 'delete',
      params: { id: conversation.id },
    },
  };
}


export function markConversationAsRead(conversation) {
  return {
    type: actionTypes.CONVERSATION_MARK_READ,
    payload: { conversation },
  };
}

export function readConversation(conversation) {
  return {
    types: [
      actionTypes.CONVERSATION_READ_START,
      actionTypes.CONVERSATION_READ_SUCCESS,
      actionTypes.CONVERSATION_READ_FAILURE,
    ],
    payload: { conversation },
    service: {
      name: 'conversationRead',
      method: 'create',
      params: { id: conversation.id },
    },
  };
}

export function unreadConversation(conversation) {
  return {
    types: [
      actionTypes.CONVERSATION_MARK_UNREAD_START,
      actionTypes.CONVERSATION_MARK_UNREAD_SUCCESS,
      actionTypes.CONVERSATION_MARK_UNREAD_FAILURE,
    ],
    payload: { conversation },
    service: {
      name: 'conversationRead',
      method: 'delete',
      params: { id: conversation.id },
    },
  };
}

export function replaceConversation(normalizedPayload) {
  return {
    type: actionTypes.CONVERSATION_REPLACE,
    payload: normalizedPayload,
  };
}
