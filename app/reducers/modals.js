import * as actionTypes from '../actions/actionTypes';

const initialState = {
  show: false,
  body: null,

  // Header options
  closeButton: false,
  title: null,

  backdrop: true,
  bsSize: null,

  scrollableBody: false,

  // Footer options

};
export default function modalsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CLOSE_MODAL:
      return { ...state, show: false };
    case actionTypes.OPEN_MODAL:
      return { ...initialState, ...action.payload };
  }
  return state;
}
