
import * as actionTypes from './actionTypes';

export function loadConversations() {
  return {
    types: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE,
    ],
    service: {
      name: 'conversations',
    },
  };
}

export function loadListeners(user) {
  return {
    types: [
      actionTypes.LOAD_LISTENERS_START,
      actionTypes.LOAD_LISTENERS_SUCCESS,
      actionTypes.LOAD_LISTENERS_FAILURE,
    ],
    service: {
      name: 'listeners',
      params: { user },
    },
  };
}

export function loadListening(user) {
  return {
    types: [
      actionTypes.LOAD_LISTENING_START,
      actionTypes.LOAD_LISTENING_SUCCESS,
      actionTypes.LOAD_LISTENING_FAILURE,
    ],
    service: {
      name: 'listeners',
      params: { user },
    },
  };
}
