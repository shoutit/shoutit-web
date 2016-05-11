import omit from 'lodash/omit';

import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

function shoutsByTagName(state = {}, action) {
  if (action.type === actionTypes.INVALIDATE_TAG_SHOUTS) {
    return omit(state, action.payload.name);
  }
  return state;
}
export default function (state = {}, action) {
  let newState = paginate({
    mapActionToKey: action => action.payload.name,
    fetchTypes: [
      actionTypes.LOAD_TAG_SHOUTS_START,
      actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
      actionTypes.LOAD_TAG_SHOUTS_FAILURE,
    ],
  })(state, action);
  newState = shoutsByTagName(newState, action);
  return newState;

}
