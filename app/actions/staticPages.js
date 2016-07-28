import * as actionTypes from './actionTypes';

export function loadStaticResource(id) {
  return {
    types: [
      actionTypes.LOAD_STATIC_START,
      actionTypes.LOAD_STATIC_SUCCESS,
      actionTypes.LOAD_STATIC_FAILURE,
    ],
    service: {
      name: 'staticResource',
      params: { id },
    },
  };
}
