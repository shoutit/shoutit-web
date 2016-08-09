import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  fetchTypes: [
    actionTypes.LOAD_HOME_SHOUTS_START,
    actionTypes.LOAD_HOME_SHOUTS_SUCCESS,
    actionTypes.LOAD_HOME_SHOUTS_FAILURE,
  ],
});

export function getHomepageShouts(state) {
  return state.paginated.shoutsByHome.ids.map(
    id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export const getPaginationState = state => getPagination(state, 'shoutsByHome');
