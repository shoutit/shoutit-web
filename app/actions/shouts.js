
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function loadShout(id) {
  return {
    types: [
      actionTypes.LOAD_SHOUT_START,
      actionTypes.LOAD_SHOUT_SUCCESS,
      actionTypes.LOAD_SHOUT_FAILURE,
    ],
    payload: { id },
    service: {
      name: 'shout',
      params: { id },
      schema: Schemas.SHOUT,
    },
  };
}

export function loadRelatedShouts(shoutId, query, endpoint) {
  return {
    types: [
      actionTypes.LOAD_RELATED_SHOUTS_START,
      actionTypes.LOAD_RELATED_SHOUTS_SUCCESS,
      actionTypes.LOAD_RELATED_SHOUTS_FAILURE,
    ],
    payload: { shoutId, endpoint },
    service: {
      name: 'relatedShouts',
      params: { shoutId },
      schema: Schemas.SHOUTS,
    },
  };
}

export function createShout(user, shout) {
  return {
    types: [
      actionTypes.CREATE_SHOUT_START,
      actionTypes.CREATE_SHOUT_SUCCESS,
      actionTypes.CREATE_SHOUT_FAILURE,
    ],
    payload: { shout, username: user.username },
    service: {
      method: 'create',
      name: 'shout',
      body: shout,
      schema: Schemas.SHOUT,
    },
  };
}

export function updateShout(shout) {
  return {
    types: [
      actionTypes.UPDATE_SHOUT_START,
      actionTypes.UPDATE_SHOUT_SUCCESS,
      actionTypes.UPDATE_SHOUT_FAILURE,
    ],
    payload: { shout },
    service: {
      method: 'update',
      name: 'shout',
      params: { id: shout.id },
      body: shout,
      schema: Schemas.SHOUT,
    },
  };
}
