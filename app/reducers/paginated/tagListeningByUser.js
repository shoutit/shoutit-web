import without from 'lodash/without';
import union from 'lodash/union';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

function tagListeningByUser(state = {}, action) {
  const { type, payload } = action;
  switch (type) {

    case actionTypes.LISTEN_TAG_START:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: true,
          ids: union(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], [payload.tag.id]),
        },
      };

    case actionTypes.STOP_LISTEN_TAG_START:
      const newState = {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: true,
          ids: without(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], payload.tag.id),
        },
      };
      return newState;

    case actionTypes.LISTEN_TAG_SUCCESS:
    case actionTypes.STOP_LISTEN_TAG_SUCCESS:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
        },
      };

    case actionTypes.LISTEN_TAG_FAILURE:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
          ids: without(state[payload.loggedUser.id].ids, payload.tag.id),
        },
      };

    case actionTypes.STOP_LISTEN_TAG_FAILURE:
      return {
        ...state,
        [payload.loggedUser.id]: {
          ...state[payload.loggedUser.id],
          isUpdating: false,
          ids: union(state[payload.loggedUser.id] ? state[payload.loggedUser.id].ids : [], [payload.tag.id]),
        },
      };
  }
  return state;
}

export default function (state = {}, action) {
  let newState = createPaginatedReducer({
    mapActionToKey: action => action.payload.user.id,
    fetchTypes: [
      actionTypes.LOAD_LISTENING_TAGS_START,
      actionTypes.LOAD_LISTENING_TAGS_SUCCESS,
      actionTypes.LOAD_LISTENING_TAGS_FAILURE,
    ],
  })(state, action);

  newState = tagListeningByUser(newState, action);
  return newState;
}

export function getListeningTags(state, profile) {
  const tagListeningByUser = state.paginated.tagListeningByUser[profile.id];
  if (!tagListeningByUser) {
    return [];
  }
  return tagListeningByUser.ids.map(id => denormalize(state.entities.tags[id], state.entities, 'TAG'));
}


export function getPaginationState(state, profile) {
  return getPagination(state, ['tagListeningByUser', profile.id]);
}

