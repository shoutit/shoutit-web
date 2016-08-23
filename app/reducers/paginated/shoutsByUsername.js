import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.username,
  mapActionToTempId: action => action.payload.shout.id,
  fetchTypes: [
    actionTypes.LOAD_PROFILE_SHOUTS_START,
    actionTypes.LOAD_PROFILE_SHOUTS_SUCCESS,
    actionTypes.LOAD_PROFILE_SHOUTS_FAILURE,
  ],
});

export function getShoutsByUsername(state, username) {
  const paginated = state.paginated.shoutsByUsername[username];
  if (!paginated) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'SHOUTS');
}

export function getPaginationState(state, username) {
  return getPagination(state, ['shoutsByUsername', username]);
}
