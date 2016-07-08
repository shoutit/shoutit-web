import * as actionTypes from '../../actions/actionTypes';
import paginate, { getPagination, getPageState } from './paginate';
import { denormalize } from '../../schemas';

const initialState = { ids: [] };

function shouts(state = {}, action) {
  switch (action.type) {
    case actionTypes.INVALIDATE_SHOUTS:
      return initialState;
  }
  return state;
}

export default function (state = initialState, action) {
  let newState = paginate({
    actionTypes: [
      actionTypes.LOAD_SHOUTS_START,
      actionTypes.LOAD_SHOUTS_SUCCESS,
      actionTypes.LOAD_SHOUTS_FAILURE,
    ],
  })(state, action);

  newState = shouts(newState, action);
  return newState;
}

export const getShouts = (state, page) =>
  denormalize(
    state.paginated.shouts[page] ?
    state.paginated.shouts[page].ids :
    [],
    state.entities, 'SHOUTS'
  );

export const getShoutsPagination = (state) => getPagination(state, 'shouts');
export const getShoutsPageState = (state, page) => getPageState(state, page, 'shouts');
