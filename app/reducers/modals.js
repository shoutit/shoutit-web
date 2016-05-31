import * as actionTypes from '../actions/actionTypes';
import { blurActiveElement } from '../utils/DOMUtils';

const initialState = {
  modal: null,
};
export default function modalsReducer(state = initialState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
    case actionTypes.CLOSE_MODAL:
      return { modal: null };
    case actionTypes.OPEN_MODAL:
      blurActiveElement();
      return { modal: action.payload.modal };

  }
  return state;
}
