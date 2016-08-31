import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.username,
  fetchTypes: [
    actionTypes.LOAD_PROFILE_PAGES_START,
    actionTypes.LOAD_PROFILE_PAGES_SUCCESS,
    actionTypes.LOAD_PROFILE_PAGES_FAILURE,
  ],
});

export function getPagesByUsername(state, username) {
  const paginated = state.paginated.pagesByUsername[username];
  if (!paginated) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'PROFILES');
}

export function getPaginationState(state, username) {
  return getPagination(state, ['pagesByUsername', username]);
}
