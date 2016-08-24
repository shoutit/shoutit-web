import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { getPagination } from '../paginated';

function listenersByTag(state = {}, action) {
  const { type, payload } = action;
  switch (type) {

    case actionTypes.LISTEN_TAG_START:
      return {
        ...state,
        [payload.tag.id]: {
          ...state[payload.tag.id],
          // isUpdating: true,
          ids: union(state[payload.tag.id] ? state[payload.tag.id].ids : [], [payload.loggedUser.id]),
        },
      };

    case actionTypes.STOP_LISTEN_TAG_START:
      return {
        ...state,
        [payload.tag.id]: {
          ...state[payload.tag.id],
          // isUpdating: true,
          ids: without(state[payload.tag.id] ? state[payload.tag.id].ids : [], payload.loggedUser.id),
        },
      };

    case actionTypes.LISTEN_TAG_SUCCESS:
    case actionTypes.STOP_LISTEN_TAG_SUCCESS:
      return {
        ...state,
        [payload.tag.id]: {
          ...state[payload.tag.id],
          // isUpdating: false,
        },
      };

    case actionTypes.LISTEN_TAG_FAILURE:
      return {
        ...state,
        [payload.tag.id]: {
          ...state[payload.tag.id],
          // isUpdating: false,
          ids: without(state[payload.tag.id].ids, payload.loggedUser.id),
        },
      };

    case actionTypes.STOP_LISTEN_TAG_FAILURE:
      return {
        ...state,
        [payload.tag.id]: {
          ...state[payload.tag.id],
          isUpdating: false,
          ids: union(state[payload.tag.id] ? state[payload.tag.id].ids : [], [payload.loggedUser.id]),
        },
      };
  }
  return state;
}

export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.tag.id,
    fetchTypes: [
      actionTypes.LOAD_TAG_LISTENERS_START,
      actionTypes.LOAD_TAG_LISTENERS_SUCCESS,
      actionTypes.LOAD_TAG_LISTENERS_FAILURE,
    ],
  })(state, action);

  newState = listenersByTag(newState, action);
  return newState;
}

export function getListenersByTag(state, id) {
  const paginated = state.paginated.listenersByTag[id];
  if (!paginated || !paginated.ids) {
    return undefined;
  }
  return paginated.ids.map(id => state.entities.users[id]);
}


export function getPaginationState(state, id) {
  return getPagination(state, ['listenersByTag', id]);
}

