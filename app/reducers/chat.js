import * as actionTypes from "../actions/actionTypes";
import union from "lodash/array/union";

const initialState = {
  nextUrl: null,
  previousUrl: null,
  isFetching: false,
  ids: [],  // conversation ids
  error: false
};

export default function(state=initialState, action) {
  switch (action.type) {
  case actionTypes.LOAD_CONVERSATIONS_START:
    return { ...state, isFetching: true };
  case actionTypes.LOAD_CONVERSATIONS_SUCCESS:
    return { ...state, isFetching: false, ids: union(action.payload.result, state.ids) };
  case actionTypes.LOAD_CONVERSATIONS_FAILURE:
    return { ...state, isFetching: false, error: action.payload };
  case actionTypes.DELETE_CONVERSATION_START:
    return { ...state, ids: state.ids.filter(id => id !== action.payload.id) };
  default:
    return state;
  }
}
