import uuid from 'uuid';
import merge from 'lodash/merge';
import set from 'lodash/set';

import { getUnixTime } from '../utils/DateUtils';
import * as actionTypes from './actionTypes';
import { CONVERSATION, MESSAGE } from '../schemas';

export const loadConversation = id => ({
  types: [
    actionTypes.LOAD_CONVERSATION_START,
    actionTypes.LOAD_CONVERSATION_SUCCESS,
    actionTypes.LOAD_CONVERSATION_FAILURE,
  ],
  service: {
    name: 'conversations',
    params: { id },
    schema: CONVERSATION,
  },
});

export const setCurrentConversation = id => ({
  type: actionTypes.SET_CURRENT_CONVERSATION,
  payload: id,
});

export const unsetCurrentConversation = () => ({
  type: actionTypes.SET_CURRENT_CONVERSATION,
  payload: null,
});

export function replyToConversation(conversationId, sender, message) {
  const newMessage = {
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
    payload: {
      conversationId,
      message: newMessage,
    },
    service: {
      name: 'conversationReply',
      method: 'create',
      params: { conversationId },
      body: message,
      schema: MESSAGE,
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
    type: actionTypes.OPEN_CONVERSATION,
    payload: {
      conversation,
      entities: {
        conversations: {
          [conversation.id]: conversation,
        },
      },
    },
  };
}

export function leave(conversation) {
  return {
    types: [
      actionTypes.LEAVE_CONVERSATION_START,
      actionTypes.LEAVE_CONVERSATION_SUCCESS,
      actionTypes.LEAVE_CONVERSATION_FAILURE,
    ],
    payload: { conversation },
    service: {
      name: 'conversations',
      method: 'delete',
      params: { id: conversation.id },
    },
  };
}

export function read(conversation) {
  const { id, unreadMessagesCount } = conversation;
  return {
    types: [
      actionTypes.READ_CONVERSATION_START,
      actionTypes.READ_CONVERSATION_SUCCESS,
      actionTypes.READ_CONVERSATION_FAILURE,
    ],
    payload: {
      conversation,
    },
    service: {
      name: 'conversationRead',
      method: 'create',
      params: { id },
      parsePayload: (payload, state, err) => {
        if (err) {
          return payload;
        }
        const parsedPayload = set({}, `entities.conversations.${id}.unreadMessagesCount`, 0);
        if (unreadMessagesCount > 0) {
          const { unreadConversationsCount } = state.entities.users[state.session.user].stats;
          set(
            parsedPayload,
            `entities.users.${state.session.user}.stats.unreadConversationsCount`,
            unreadConversationsCount - 1
          );
        }
        return parsedPayload;
      },
    },
  };
}

export function unread(conversation) {
  const { id, unreadMessagesCount } = conversation;
  return {
    types: [
      actionTypes.UNREAD_CONVERSATION_START,
      actionTypes.UNREAD_CONVERSATION_SUCCESS,
      actionTypes.UNREAD_CONVERSATION_FAILURE,
    ],
    payload: {
      conversation,
    },
    service: {
      name: 'conversationRead',
      method: 'delete',
      params: { id },
      parsePayload: (payload, state) => {
        if (payload.error) {
          return payload;
        }
        const parsedPayload = set({}, `entities.conversations.${id}.unreadMessagesCount`, 1);
        if (unreadMessagesCount === 0) {
          set(
            parsedPayload,
            `entities.users.${state.session.user}.stats.unreadConversationsCount`,
            state.entities.users[state.session.user].stats.unreadConversationsCount + 1
          );
        }
        return parsedPayload;
      },
    },
  };
}
