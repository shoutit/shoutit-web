import omit from 'lodash/omit';

import * as actionTypes from '../actions/actionTypes';
import { stringifySearchParams } from '../utils/SearchUtils';

import paginate from './paginate';

function shoutsBySearch(state = {}, action) {
  switch (action.type) {
    case actionTypes.INVALIDATE_SHOUTS_SEARCH:
      return omit(state, stringifySearchParams(action.payload.searchParams));
  }
  return state;
}

export default function (state = {}, action) {
  let newState = paginate({
    mapActionToKey: action => stringifySearchParams(action.payload.searchParams),
    fetchTypes: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
  })(state, action);

  newState = shoutsBySearch(newState, action);
  return newState;
}
