import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getState } from '../paginated';

const initialState = { ids: [] };

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

export const getShouts = state =>
  state.paginated.shouts.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );

export const getPaginationState = state => getState(state, 'shouts');
