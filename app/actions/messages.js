import * as actionTypes from './actionTypes';
import { MESSAGES } from '../schemas';

export const loadMessages = (conversation, endpoint) => ({
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
});

export const readMessage = message => ({
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
});

export const setMessageReadBy = readBy => ({
  type: actionTypes.SET_MESSAGE_READ_BY,
  payload: readBy,
});

export const addNewMessage = normalizedPayload => {
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
};
