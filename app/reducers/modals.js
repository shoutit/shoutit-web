import * as actionTypes from '../actions/actionTypes';
import { blurActiveElement } from '../utils/DOMUtils';

const initialState = {
  modal: null,
  isAlreadyVisible: false,
};

export default function modalsReducer(state = initialState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
    case actionTypes.CLOSE_MODAL:
      return {
        modal: null,
        alreadyVisible: false,
      };
    case actionTypes.OPEN_MODAL:
      blurActiveElement();
      return {
        modal: action.payload.modal,
        isAlreadyVisible: !!state.modal,
      };
  }
  return state;
}

export function getModal(state) {
  return state.modals.modal;
}
export function isAlreadyVisible(state) {
  return state.modals.isAlreadyVisible;
}
