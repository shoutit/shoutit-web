import * as actionTypes from './actionTypes';

export function dismissUINotification(id) {
  return {
    type: actionTypes.DISMISS_UI_NOTIFICATION,
    payload: id,
  };
}

export function closeModal() {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
}

export function openModal(body, options) {
  return {
    type: actionTypes.OPEN_MODAL,
    payload: { body, ...options, show: true },
  };
}
