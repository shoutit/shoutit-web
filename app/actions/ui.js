import * as actionTypes from './actionTypes';

export function closeModal() {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
}

export function openModal(modal) {
  return {
    type: actionTypes.OPEN_MODAL,
    payload: { modal },
  };
}
