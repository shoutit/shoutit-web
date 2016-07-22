import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.shoutId,
  fetchTypes: [
    actionTypes.LOAD_RELATED_SHOUTS_START,
    actionTypes.LOAD_RELATED_SHOUTS_SUCCESS,
    actionTypes.LOAD_RELATED_SHOUTS_FAILURE,
  ],
});

export function getRelatedShouts(state, shoutId) {
  if (!state.paginated.relatedShoutsByShout[shoutId]) {
    return [];
  }
  return denormalize(state.paginated.relatedShoutsByShout[shoutId].ids, state.entities, 'SHOUTS');
}
