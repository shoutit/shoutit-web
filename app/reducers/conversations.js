import * as actionTypes from "../actions/actionTypes";

export default function(state={}, action) {
  switch (action.type) {

  case actionTypes.LOAD_CONVERSATIONS_START:
    return state;

  case actionTypes.LOAD_CONVERSATIONS_SUCCESS:
    return state;

  case actionTypes.LOAD_CONVERSATIONS_FAILURE:
    return state;

  default: return state;
  }

}
