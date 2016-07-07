import * as actionTypes from '../actions/actionTypes';
import { denormalize } from '../schemas';

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.LOAD_SORT_TYPES_SUCCESS:
      return action.payload.result;
    default: return state;
  }
}

export function getSortTypes(state) {
  return denormalize(state.sortTypes, state.entities, 'SORT_TYPES');
}
