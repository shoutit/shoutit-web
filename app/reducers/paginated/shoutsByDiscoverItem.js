import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.discoverItemId,
  fetchTypes: [
    actionTypes.DISCOVERITEMS_SHOUTS_LOAD_START,
    actionTypes.DISCOVERITEMS_SHOUTS_LOAD_SUCCESS,
    actionTypes.DISCOVERITEMS_SHOUTS_LOAD_FAILURE,
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
