import omit from 'lodash/omit';
import { denormalize } from '../../schemas';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { getState } from '../paginated';

function shoutsByTagName(state = {}, action) {
  if (action.type === actionTypes.INVALIDATE_TAG_SHOUTS) {
    return omit(state, action.payload.name);
  }
  return state;
}
export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.name,
    fetchTypes: [
      actionTypes.LOAD_TAG_SHOUTS_START,
      actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
      actionTypes.LOAD_TAG_SHOUTS_FAILURE,
    ],
  })(state, action);
  newState = shoutsByTagName(newState, action);
  return newState;

}

export function getShoutsByTagname(state, name) {
  const shoutsByTagname = state.paginated.shoutsByTagname[name];
  if (!shoutsByTagname) {
    return [];
  }
  return shoutsByTagname.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export function getPaginationState(state, name) {
  return getState(state, `shoutsByTagname.${name}`);
}
