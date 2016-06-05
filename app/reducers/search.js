import * as actionTypes from '../actions/actionTypes';
import { denormalize } from '../schemas';
import createPaginatedReducer from './paginated/createPaginatedReducer';

const initialState = {
  shouts: { ids: [] },
  tags: { ids: [] },
  users: { ids: [] },
  query: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.INVALIDATE_SEARCH:
      return initialState;
    case actionTypes.SEARCH_SHOUTS_START:
    case actionTypes.SEARCH_PROFILES_START:
    case actionTypes.SEARCH_TAGS_START:
      state = { ...state,
        query: action.payload.searchParams.search,
      };
      break;
    case actionTypes.SEARCH_SHOUTS_SUCCESS:
    case actionTypes.SEARCH_PROFILES_SUCCESS:
    case actionTypes.SEARCH_TAGS_SUCCESS:
      if (state.query !== action.payload.searchParams.search) {
        // Ignore results coming from previous seaerches
        return state;
      }
      break;
  }

  // Reset previous results
  switch (action.type) {
    case actionTypes.SEARCH_SHOUTS_SUCCESS:
      state = { ...state, shouts: initialState.shouts };
      break;
    case actionTypes.SEARCH_PROFILES_SUCCESS:
      state = { ...state, users: initialState.users };
      break;
    case actionTypes.SEARCH_TAGS_SUCCESS:
      state = { ...state, tags: initialState.tags };
      break;
  }
  const shouts = createPaginatedReducer({
    fetchTypes: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ] })(state.shouts, action);

  const users = createPaginatedReducer({
    fetchTypes: [
      actionTypes.SEARCH_PROFILES_START,
      actionTypes.SEARCH_PROFILES_SUCCESS,
      actionTypes.SEARCH_PROFILES_FAILURE,
    ] })(state.users, action);

  const tags = createPaginatedReducer({
    fetchTypes: [
      actionTypes.SEARCH_TAGS_START,
      actionTypes.SEARCH_TAGS_SUCCESS,
      actionTypes.SEARCH_TAGS_FAILURE,
    ] })(state.tags, action);

  return { ...state, shouts, tags, users };
}

export const getShouts = state =>
  state.search.shouts.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT'));

export const getTags = state =>
  state.search.tags.ids.map(id =>
    denormalize(state.entities.tags[id], state.entities, 'TAG')
  );

export const getProfiles = state =>
  state.search.users.ids.map(id =>
    denormalize(state.entities.users[id], state.entities, 'PROFILE')
  );

export const isFetching = state =>
  state.search.users.isFetching &&
  state.search.tags.isFetching &&
  state.search.shouts.isFetching;

export const hasMoreShouts = state =>
  !!state.search.shouts.nextUrl;
