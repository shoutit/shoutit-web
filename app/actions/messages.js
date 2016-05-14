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
