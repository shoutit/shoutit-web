import * as actionTypes from '../actions/actionTypes';
import { denormalize } from '../schemas';

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.LOAD_CURRENCIES_SUCCESS:
      return action.payload.result;
    default: return state;
  }
}

export function getCurrencies(state) {
  return denormalize(state.currencies, state.entities, 'CURRENCIES');
}
