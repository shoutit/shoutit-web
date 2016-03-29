
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function loadUser(username) {
  return {
    types: [
      actionTypes.LOAD_USER_START,
      actionTypes.LOAD_USER_SUCCESS,
      actionTypes.LOAD_USER_FAILURE,
    ],
    service: {
      name: 'profile',
      params: { username },
      schema: Schemas.USER,
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
