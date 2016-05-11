import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

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
  let newState = paginate({
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
