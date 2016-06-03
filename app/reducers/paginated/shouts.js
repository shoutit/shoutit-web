import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

const initialState = { ids: [] }
;
function shouts(state = {}, action) {
  switch (action.type) {
    case actionTypes.INVALIDATE_SHOUTS_SEARCH:
      return initialState;
  }
  return state;
}

export default function (state = initialState, action) {
  let newState = createPaginatedReducer({
    fetchTypes: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
  })(state, action);

  newState = shouts(newState, action);
  return newState;
}
