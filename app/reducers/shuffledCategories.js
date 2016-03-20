import * as actionTypes from "../actions/actionTypes";
import shuffle from "lodash/collection/shuffle";

export default function(state=[], action) {
  if (action.type === actionTypes.LOAD_CATEGORIES_SUCCESS) {
    return shuffle(action.payload.result);
  }
  return state;
}
