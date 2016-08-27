import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.country,
  fetchTypes: [
    actionTypes.DISCOVERITEMS_LOAD_START,
    actionTypes.DISCOVERITEMS_LOAD_SUCCESS,
    actionTypes.DISCOVERITEMS_LOAD_FAILURE,
  ],
});

export function getDiscoverItemsByCountry(state, country) {
  const paginated = state.paginated.discoverItemsByCountry[country];
  if (!paginated) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'DISCOVERITEMS');
}

export function getPaginationState(state, id) {
  return getPagination(state, ['shoutsByDiscoverItem', id]);
}
