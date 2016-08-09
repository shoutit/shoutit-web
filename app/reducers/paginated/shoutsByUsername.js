import get from 'lodash/get';
import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getState } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.username,
  mapActionToTempId: action => action.payload.shout.id,
  fetchTypes: [
    actionTypes.LOAD_USER_SHOUTS_START,
    actionTypes.LOAD_USER_SHOUTS_SUCCESS,
    actionTypes.LOAD_USER_SHOUTS_FAILURE,
  ],
});

export function getShoutsByUsername(state, username) {
  const paginated = state.paginated.shoutsByUsername[username];
  if (!paginated) {
    return [];
  }
  return paginated.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export function getPaginationState(state, username) {
  return get(getState(state), ['shoutsByUsername', username]);
}
