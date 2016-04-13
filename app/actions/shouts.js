
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
