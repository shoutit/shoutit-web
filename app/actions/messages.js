import * as actionTypes from './actionTypes';
import { MESSAGES } from '../schemas';

export function loadMessages(conversation, endpoint) {
  return {
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE,
    ],
    payload: { conversation },
    service: {
      name: 'messages',
      params: { id: conversation.id, endpoint },
      schema: MESSAGES,
    },
  };
}

export function readMessage(message) {
  return {
    types: [
      actionTypes.READ_MESSAGE_START,
      actionTypes.READ_MESSAGE_SUCCESS,
      actionTypes.READ_MESSAGE_FAILURE,
    ],
    payload: { message },
    service: {
      name: 'messagesRead',
      method: 'create',
      params: { id: message.id },
      schema: MESSAGES,
    },
  };
}

export function addNewMessage(normalizedPayload) {
  const { entities, result: id } = normalizedPayload;
  return {
    type: actionTypes.ADD_NEW_MESSAGE,
    payload: {
      message: entities.messages[id],
      conversation: {
        id: entities.messages[id].conversationId,
      },
      ...normalizedPayload,
    },
  };
}
