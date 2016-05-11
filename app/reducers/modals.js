import * as actionTypes from '../actions/actionTypes';
import without from 'lodash/without';

export default function modalsReducer(state = [], action) {
  switch (action.type) {
    case actionTypes.CLOSE_MODAL:
      let modal = action.payload;
      if (typeof modal === 'string') {
        modal = state.find(m => m.props.name === action.payload);
      }
      return without(state, modal);
    case actionTypes.OPEN_MODAL:
      return [...state, action.payload];
  }
  return state;
}
