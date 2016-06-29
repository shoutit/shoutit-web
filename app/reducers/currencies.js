import * as actionTypes from '../actions/actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.LOAD_CURRENCIES_SUCCESS:
      return action.payload.result;
    default: return state;
  }
}

export function getCurrencies(state) {
  return state.currencies.map(code => state.entities.currencies[code]);
}
