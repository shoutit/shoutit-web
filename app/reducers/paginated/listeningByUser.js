import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

function listeningByUser(state = {}, action) {
  const { type, payload } = action;
  switch (type) {

    case actionTypes.LISTEN_START:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: true,
          ids: union(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], [payload.user.id]),
        },
      };

    case actionTypes.STOP_LISTEN_START:
      const newState = {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: true,
          ids: without(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], payload.user.id),
        },
      };
      return newState;

    case actionTypes.LISTEN_SUCCESS:
    case actionTypes.STOP_LISTEN_SUCCESS:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
        },
      };

    case actionTypes.LISTEN_FAILURE:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
          ids: without(state[payload.loggedUser.id].ids, payload.user.id),
        },
      };

    case actionTypes.STOP_LISTEN_FAILURE:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
          ids: union(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], [payload.user.id]),
        },
      };
  }
  return state;
}

export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.user.id,
    fetchTypes: [
      actionTypes.LOAD_LISTENING_PROFILES_START,
      actionTypes.LOAD_LISTENING_PROFILES_SUCCESS,
      actionTypes.LOAD_LISTENING_PROFILES_FAILURE,
    ],
  })(state, action);

  newState = listeningByUser(newState, action);
  return newState;
}

export function getListeningByProfile(state, id) {
  const paginated = state.paginated.listeningByUser[id];
  if (!paginated) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'PROFILES');
}

export function getPaginationState(state, id) {
  return getPagination(state, ['listeningByUser', id]);
}
