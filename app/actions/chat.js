import * as actionTypes from './actionTypes';
import uuid from 'uuid';
import merge from 'lodash/object/merge';

import { getUnixTime } from '../utils/DateUtils';
import { Schemas } from '../schemas';

const parsePayloadForConversations = (payload, state) => {
  if (payload.error) {
    return payload;
  }
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

export function loadConversations(endpoint) {
  return {
    types: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE,
    ],
    service: {
      name: 'conversations',
      params: { endpoint },
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

export function notifyTypingUser(user) {
  return {
    type: actionTypes.NOTIFY_CLIENT_IS_TYPING,
    payload: user,
  };
}

export function openConversation(conversation) {
  return {
    type: actionTypes.OPEN_CONVERSATION,
    payload: {
      conversation,
    },
  };
}

export function startConversation(loggedUser, user) {
  const conversation = {
    id: `new-conversation-with-${user.id}`,
    isNew: true,
    type: 'chat',
    profiles: [
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

export function startShoutReply(loggedUser, shout) {
  const conversation = {
    id: `shout-reply-${shout.id}`,
    isNew: true,
    type: 'about_shout',
    about: shout.id,
    profiles: [
      shout.profile.id,
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

export function replyToShout(conversation, text) {
  const { about: shout } = conversation;
  return {
    types: [
      actionTypes.CREATE_CONVERSATION_START,
      actionTypes.CREATE_CONVERSATION_SUCCESS,
      actionTypes.CREATE_CONVERSATION_FAILURE,
    ],
    payload: {
      conversation,
    },
    service: {
      name: 'shoutReply',
      method: 'create',
      params: { shout },
      body: { text },
      schema: Schemas.CONVERSATION,
    },
  };
}

export function chatWithProfile(conversation, text) {
  const username = conversation.profiles.filter(profile => !profile.isOwner)[0].username;
  return {
    types: [
      actionTypes.CREATE_CONVERSATION_START,
      actionTypes.CREATE_CONVERSATION_SUCCESS,
      actionTypes.CREATE_CONVERSATION_FAILURE,
    ],
    payload: {
      conversation,
    },
    service: {
      name: 'profileChat',
      method: 'create',
      params: { username },
      body: { text },
      schema: Schemas.CONVERSATION,
    },
  };
}

export function closeConversation(conversationId) {
  return {
    type: actionTypes.CLOSE_CONVERSATION,
    payload: { conversationId },
  };
}
