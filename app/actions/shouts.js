
import * as actionTypes from './actionTypes';
import { SHOUT, SHOUTS } from '../schemas';
import { getUnixTime } from '../utils/DateUtils';

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
      schema: SHOUT,
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
      schema: SHOUTS,
    },
  };
}

export function createShout(user, newShout) {
  const shout = {
    ...newShout,
    createdAt: getUnixTime(),
  };
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
      schema: SHOUT,
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
      schema: SHOUT,
    },
  };
}

export function deleteShout(shout) {
  return {
    types: [
      actionTypes.DELETE_SHOUT_START,
      actionTypes.DELETE_SHOUT_SUCCESS,
      actionTypes.DELETE_SHOUT_FAILURE,
    ],
    payload: { shout },
    service: {
      method: 'delete',
      name: 'shout',
      params: { shout },
      body: shout,
      schema: SHOUT,
    },
  };
}

export function amendShout(shout, data) {
  return {
    type: actionTypes.AMEND_SHOUT,
    payload: {
      entities: {
        shouts: {
          [shout.id]: {
            ...shout,
            ...data,
          },
        },
      },
    },
  };
}

export function call(shout) {
  return {
    types: [
      actionTypes.UPDATE_SHOUT_START,
      actionTypes.UPDATE_SHOUT_SUCCESS,
      actionTypes.UPDATE_SHOUT_FAILURE,
    ],
    payload: { shout: { id: shout.id } },
    service: {
      name: 'shoutCall',
      params: { shout },
      schema: SHOUT,
    },
  };
}
