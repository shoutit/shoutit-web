import * as actionTypes from "../actions/actionTypes";

export default function(state=[], action) {
  switch (action.type) {

  case actionTypes.LOAD_CURRENCIES_SUCCESS:
    return action.payload;

  default: return state;
  }

}
