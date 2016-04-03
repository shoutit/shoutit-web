import * as actionTypes from './actionTypes';

export function dismissUINotification(id) {
  return {
    type: actionTypes.DISMISS_UI_NOTIFICATION,
    payload: id,
  };
}

export function closeModal(id) {
  return {
    type: actionTypes.CLOSE_MODAL,
    payload: id,
  };
}

export function openModal(modal) {
  return {
    type: actionTypes.OPEN_MODAL,
    payload: modal,
  };
}
