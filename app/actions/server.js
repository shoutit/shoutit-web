import * as actionTypes from './actionTypes';

const errorToPlainObject = err => {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach(key => {
    plainObject[key] = err[key];
  });
  return plainObject;
};

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

export function routeError(error) {
  return {
    type: actionTypes.ROUTE_ERROR,
    payload: errorToPlainObject(error),
  };
}
