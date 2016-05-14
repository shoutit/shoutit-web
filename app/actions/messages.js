import * as actionTypes from './actionTypes';
import { MESSAGES } from '../schemas';

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
      schema: MESSAGES,
    },
  };
}

export function addMessage(payload) {  // normalized payload
  return {
    type: actionTypes.ADD_MESSAGE,
    payload,
  };
}
