import omit from 'lodash/omit';
import { denormalize } from '../../schemas';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { getPagination } from '../paginated';

function shoutsByTagSlug(state = {}, action) {
  if (action.type === actionTypes.INVALIDATE_TAG_SHOUTS) {
    return omit(state, action.payload.slug);
  }
  return state;
}
export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.slug,
    fetchTypes: [
      actionTypes.LOAD_TAG_SHOUTS_START,
      actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
      actionTypes.LOAD_TAG_SHOUTS_FAILURE,
    ],
  })(state, action);
  newState = shoutsByTagSlug(newState, action);
  return newState;

}

export function getShoutsByTagSlug(state, slug) {
  const shoutsByTagSlug = state.paginated.shoutsByTagSlug[slug];
  if (!shoutsByTagSlug) {
    return [];
  }
  return shoutsByTagSlug.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export function getPaginationState(state, slug) {
  return getPagination(state, ['shoutsByTagSlug', slug]);
}
