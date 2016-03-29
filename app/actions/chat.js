
import * as actionTypes from './actionTypes';
import uuid from 'uuid';
import merge from 'lodash/object/merge';

import { getUnixTime } from '../utils/DateUtils';

import { Schemas } from '../schemas';

const parsePayloadForConversations = (payload, state) => {
  if (!state.chat.currentConversation) {
    return payload;
  }
  const newPayload = merge(payload, {
    entities: {
      conversations: {
        [state.chat.currentConversation]: {
          unreadMessagesCount: 0,
        },
      },
    },
  });
  return newPayload;
};

export function loadConversations() {
  return {
    types: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE,
    ],
    service: {
      name: 'conversations',
      schema: Schemas.CONVERSATIONS,
      parsePayload: parsePayloadForConversations,
    },
  };
}

export function loadConversation(id) {
  return {
    types: [
      actionTypes.LOAD_CONVERSATION_START,
      actionTypes.LOAD_CONVERSATION_SUCCESS,
      actionTypes.LOAD_CONVERSATION_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { id },
      schema: Schemas.CONVERSATION,
      parsePayload: parsePayloadForConversations,
    },
  };
}

export function loadMessages(conversationId, endpoint) {
  return {
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE,
    ],
    payload: { conversationId },
    service: {
      name: 'messages',
      params: { conversationId, endpoint },
      schema: Schemas.MESSAGES,
    },
  };
}

export function addMessage(payload) {  // normalized payload
  return {
    type: actionTypes.ADD_MESSAGE,
    payload,
  };
}

export function setCurrentConversation(id) {
  return {
    type: actionTypes.SET_CURRENT_CONVERSATION,
    payload: id,
  };
}

export function unsetCurrentConversation() {
  return {
    type: actionTypes.SET_CURRENT_CONVERSATION,
    payload: null,
  };
}

export function replyToConversation(conversationId, sender, message) {
  const newMessage = {
    ...message,
    user: sender,
    id: `temp-${uuid.v1()}`,
    createdAt: getUnixTime(),
  };
  return {
    types: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE,
    ],
    payload: {
      conversationId, message: newMessage,
    },
    service: {
      name: 'conversationReply',
      method: 'create',
      params: { conversationId },
      body: message,
      schema: Schemas.MESSAGE,
      parsePayload: payload => {
        // Add the last message to the conversation
        const messageId = payload.result;
        const lastMessage = payload.entities.messages[messageId];
        const newPayload = merge(payload, {
          entities: {
            conversations: {
              [lastMessage.conversationId]: {
                lastMessage: messageId,
                modifiedAt: message.createdAt,
              },
            },
          },
        });
        return newPayload;
      },
    },
  };
}

export function deleteConversation(id) {
  return {
    types: [
      actionTypes.LEAVE_CONVERSATION_START,
      actionTypes.LEAVE_CONVERSATION_SUCCESS,
      actionTypes.LEAVE_CONVERSATION_FAILURE,
    ],
    payload: { id },
    service: {
      name: 'conversations',
      method: 'delete',
      params: {
        id,
      },
    },
  };
}

export function typingUserNotification(conversationId, user) {
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
    type: actionTypes.TYPING_USER_NOTIFICATION,
    payload,
  };
}

export function removeTypingUser(conversationId, userId) {
  return {
    type: actionTypes.REMOVE_TYPING_USER,
    payload: { conversationId, userId },
  };
}

export function notifyTypingUser(user) {
  return {
    type: actionTypes.NOTIFY_TYPING_USER,
    payload: user,
  };
}
