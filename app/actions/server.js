import * as actionTypes from './actionTypes';

export function getServerStatus() {
  return {
    types: [
      actionTypes.SERVER_STATUS_START,
      actionTypes.SERVER_STATUS_SUCCESS,
      actionTypes.SERVER_STATUS_FAILURE,
    ],
    service: {
      name: 'server',
    },
  };
}
