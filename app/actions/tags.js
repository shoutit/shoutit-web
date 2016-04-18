
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function loadTagIfNeeded(tag, properties = []) {
  if (properties.every(property => tag.hasOwnProperty(property))) {
    return {
      type: null,
    };
  }
  const { name } = tag;
  return {
    types: [
      actionTypes.LOAD_TAG_START,
      actionTypes.LOAD_TAG_SUCCESS,
      actionTypes.LOAD_TAG_FAILURE,
    ],
    service: {
      name: 'tag',
      params: { name },
      schema: Schemas.TAG,
    },
  };
}
