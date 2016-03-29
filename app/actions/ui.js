import * as actionTypes from './actionTypes';

export function dismissUINotification(id) {
  return {
    type: actionTypes.DISMISS_UI_NOTIFICATION,
    payload: id,
  };
}
