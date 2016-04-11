
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function loadShout(id) {
  return {
    types: [
      actionTypes.LOAD_SHOUT_START,
      actionTypes.LOAD_SHOUT_SUCCESS,
      actionTypes.LOAD_SHOUT_FAILURE,
    ],
    service: {
      name: 'shout',
      params: { id },
      schema: Schemas.SHOUT,
    },
  };
}
