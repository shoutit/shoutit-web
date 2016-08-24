import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.discoverItemId,
  fetchTypes: [
    actionTypes.LOAD_DISCOVER_SHOUTS_START,
    actionTypes.LOAD_DISCOVER_SHOUTS_SUCCESS,
    actionTypes.LOAD_DISCOVER_SHOUTS_FAILURE,
  ],
});

export function getShoutsByDiscoverItem(state, id) {
  const paginated = state.paginated.shoutsByDiscoverItem[id];
  if (!paginated) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'SHOUTS');
}

export function getPaginationState(state, id) {
  return getPagination(state, ['shoutsByDiscoverItem', id]);
}
