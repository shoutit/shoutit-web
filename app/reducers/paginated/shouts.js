import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

const initialState = { ids: [] }
;
function shouts(state = {}, action) {
  switch (action.type) {
    case actionTypes.INVALIDATE_SHOUTS:
      return initialState;
  }
  return state;
}

export default function (state = initialState, action) {
  let newState = createPaginatedReducer({
    fetchTypes: [
      actionTypes.LOAD_SHOUTS_START,
      actionTypes.LOAD_SHOUTS_SUCCESS,
      actionTypes.LOAD_SHOUTS_FAILURE,
    ],
  })(state, action);

  newState = shouts(newState, action);
  return newState;
}
