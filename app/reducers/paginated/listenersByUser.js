import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

function listenersByUser(state = {}, action) {
  const { type, payload } = action;
  switch (type) {

    case actionTypes.LISTEN_START:
      return {
        ...state,
        [payload.user.id]: {
          ...state[payload.user.id],
          isUpdating: true,
          ids: union(state[payload.user.id] ? state[payload.user.id].ids : [], [payload.loggedUser.id]),
        },
      };

    case actionTypes.STOP_LISTEN_START:
      const newState = {
        ...state,
        [payload.user.id]: {
          ...state[payload.user.id],
          isUpdating: true,
          ids: without(state[payload.user.id] ? state[payload.user.id].ids : [], payload.loggedUser.id),
        },
      };
      return newState;

    case actionTypes.LISTEN_SUCCESS:
    case actionTypes.STOP_LISTEN_SUCCESS:
      return {
        ...state,
        [payload.user.id]: {
          ...state[payload.user.id],
          isUpdating: false,
        },
      };

    case actionTypes.LISTEN_FAILURE:
      return {
        ...state,
        [payload.user.id]: {
          ...state[payload.user.id],
          isUpdating: false,
          ids: without(state[payload.user.id].ids, payload.loggedUser.id),
        },
      };

    case actionTypes.STOP_LISTEN_FAILURE:
      return {
        ...state,
        [payload.user.id]: {
          ...state[payload.user.id],
          isUpdating: false,
          ids: union(state[payload.user.id] ? state[payload.user.id].ids : [], [payload.loggedUser.id]),
        },
      };
  }
  return state;
}

export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.user.id,
    fetchTypes: [
      actionTypes.LOAD_LISTENERS_START,
      actionTypes.LOAD_LISTENERS_SUCCESS,
      actionTypes.LOAD_LISTENERS_FAILURE,
    ],
  })(state, action);

  newState = listenersByUser(newState, action);
  return newState;
}
