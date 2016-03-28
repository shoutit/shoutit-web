import * as actionTypes from "../actions/actionTypes";

export default function(state=null, action) {
  switch (action.type) {
  case actionTypes.SET_CURRENT_CONVERSATION:
    return action.payload;
  default: return state;
  }
}
